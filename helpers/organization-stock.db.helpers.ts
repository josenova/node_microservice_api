// DB helpers using Knex.js

import {
  DbOrganizationStock,
  DbOrganizationStockAdjustment,
  Ec7OrganizationStockPostBody,
} from '../types';

import * as transform from '../transformers'; 

import {
  DeleteOneOperation,
  FindByFilterOperation,
  FindOneOperation,
  InsertOneOperation,
} from '../../../modules/db-helpers/operations'; // Knex Helpers

import {
  RepositoryException,
} from '../../../modules/exceptions/index';

export const createOrganizationStock = (
  db,
  query: Ec7OrganizationStockPostBody,
) =>
  new Promise<DbOrganizationStock[]>((resolve, reject) =>
    db.transaction(trx => {
      FindOneOperation<DbOrganizationStock>(
        { db, trx, resolve, reject },
        'OrganizationStock',
        {
          organizationId: query.organizationId,
          stripModelId: query.stripModelId,
        },
      )
        .then(currentStock =>
          (currentStock
            ? DeleteOneOperation(
                { db, trx, resolve, reject },
                'OrganizationStock',
                { id: currentStock.id },
              )
            : Promise.resolve(null)
          )
            .then(success =>
              InsertOneOperation<DbOrganizationStockAdjustment>(
                { db, trx, resolve, reject },
                'OrganizationStockAdjustment',
                transform.Ec7OrganizationStockPostBodyIntoDbAdjustmentQuery(
                  query,
                  currentStock ? currentStock.stock : 0,
                ),
              ),
            )
            .then(adjustmentId =>
              FindOneOperation<DbOrganizationStockAdjustment>(
                { db, trx, resolve, reject },
                'OrganizationStockAdjustment',
                { id: adjustmentId },
              ),
            )
            .then(adjustment =>
              InsertOneOperation<DbOrganizationStock>(
                { db, trx, resolve, reject },
                'OrganizationStock',
                transform.intoUpdatedDbOrganizationStock(
                  currentStock,
                  adjustment,
                ),
              ),
            )
            .then(stockId =>
              FindOneOperation<DbOrganizationStock>(
                { db, trx, resolve, reject },
                'OrganizationStock',
                { id: stockId },
              ),
            )
            .then(newStock => {
              FindByFilterOperation<DbOrganizationStock>(
                { db, trx, resolve, reject },
                'OrganizationStock',
                { organizationId: newStock.organizationId },
              ).then(stocks => {
                trx.commit();
                resolve(stocks);
              })             
            }),
        )
        .catch(
          err =>
            (trx.rollback() &&
              reject(RepositoryException(400, 'database-error', err))),
        );
    }),
  );
  