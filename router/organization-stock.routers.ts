// This is the express sub Router for this API microservice endpoint.
// Everything the module needs gets passed by dependency injection (router, db, settings) avoiding any 
// imports outside of the module. Inner functions get imported and each endpoint configured as needed.

import {
  deleteOrganizationStockStripDeliveryController,
  getOrganizationStockByIdController,
  postOrganizationStockStripDeliveryController,
  postOrganizationStockStripReceiveController,
} from '../organization-stock.controllers';
import {
  configureCreateOrganizationStockRepo,
  configureReadOrganizationStockRepo,
} from '../organization-stock.repository';
import {
  configureGetOrganizationStockByIdService,
  configurePostOrganizationStockService,
} from '../organization-stock.services';

import {
  organizationStockDeleteQueryValidator,
  organizationStockGetQueryValidator,
  organizationStockPostQueryValidator,
} from '../organization-stock.validations';

import * as transform from '../transformers';

import { configureDependencies } from '../externals';

import { configureCreateOrganizationStock } from '../db-helpers';

export const configureOrganizationStockRouter = (
  router,
  db: any,
  settings,
): Router => {

  const { getEc7StripModels } = configureDependencies(settings);
  const createOrganizationStock = configureCreateOrganizationStock(settings);

  // GET /:organizationId

  const readOrganizationStockById = configureReadOrganizationStockRepo(
    db,
    transform.fromDbOrganizationStock,
  );

  const getOrganizationStockByIdService = configureGetOrganizationStockByIdService(
    readOrganizationStockById,
    getEc7StripModels,
  );

  router.get(
    '/:organizationId',
    getOrganizationStockByIdController(
      getOrganizationStockByIdService,
      organizationStockGetQueryValidator,
      transform.intoEc7OrganizationStockList,
    ),
  );

  // POST /:organizationId/strips-delivered

  const createOrganizationStockInDb = configureCreateOrganizationStockRepo(
    db,
    createOrganizationStock,
    transform.fromDbOrganizationStock,
  );

  const postOrganizationStockService = configurePostOrganizationStockService(
    createOrganizationStockInDb,
    getEc7StripModels,
  );

  router.post(
    '/:organizationId/strips-delivered',
    postOrganizationStockStripDeliveryController(
      postOrganizationStockService,
      organizationStockPostQueryValidator,
      transform.intoEc7OrganizationStockList,
    ),
  );

  // POST /:organizationId/strips-received

  router.post(
    '/:organizationId/strips-received',
    postOrganizationStockStripReceiveController(
      postOrganizationStockService,
      organizationStockPostQueryValidator,
      transform.intoEc7OrganizationStockList,
    ),
  );

  // DELETE /:organizationId/strips-delivered

  router.delete(
    '/:organizationId/strips-delivered',
    deleteOrganizationStockStripDeliveryController(
      postOrganizationStockService,
      organizationStockDeleteQueryValidator,
      transform.intoEc7OrganizationStockList,
    ),
  );

  return router;
};
