// Transformation functions

import {
  DbOrganizationStock,
  DbOrganizationStockAdjustment,
  Merge,
  Ec7OrganizationStockPostBody,
  OrganizationStock,
} from '../types';

import { StripModel } from '../../strip-models/types';

import { format } from 'date-fns';

export const fromDbOrganizationStock: Merge<
  DbOrganizationStock,
  StripModel[],
  OrganizationStock
> = (dbOrganizationStock, ec6StripModels) => ({
    currentStock: dbOrganizationStock.stock,
    lastShipmentAt: new Date(format(dbOrganizationStock.lastShipmentAt)),
    numberOfStripsReceived: dbOrganizationStock.numberOfStripsReceived,
    stripModel: ec6StripModels.find(
      model => model.id === dbOrganizationStock.stripModelId,
    ) || { id: dbOrganizationStock.stripModelId },
  });

export const Ec7OrganizationStockPostBodyIntoDbAdjustmentQuery: Merge<
  Ec7OrganizationStockPostBody,
  number,
  DbOrganizationStockAdjustment
> = (
  {
    action,
    actionPerformedAt,
    organizationId,
    stripModelId,
    hcpId,
    numberOfStrips,
  },
  totalStock,
) => ({
  action,
  actionPerformedAt,
  hcpId,
  lastStock: totalStock,
  organizationId,
  stockChange: numberOfStrips,
  stripModelId,
});

export const intoUpdatedDbOrganizationStock: Merge<
  DbOrganizationStock,
  DbOrganizationStockAdjustment,
  DbOrganizationStock
> = (currentStock, adjustment) => ({
  hcpId: adjustment.hcpId,
  lastShipmentAt: getLastShipment(currentStock, adjustment),
  numberOfStripsReceived: getLastStripsReceived(currentStock, adjustment),
  organizationId: adjustment.organizationId,
  stock: getStock(
    adjustment.action,
    adjustment.lastStock,
    adjustment.stockChange,
  ),
  stripModelId: adjustment.stripModelId,
});

const getStock = (action, lastStock, stockChange) => {
  switch (action) {
    case 'strips received':
      return lastStock + stockChange;
    case 'strips delivered':
      return lastStock - stockChange;
    case 'strips delivered reversal':
      return lastStock + stockChange;
    case 'admin adjustment':
      return lastStock + stockChange;
  }
};

const getLastShipment = (currentStock, adjustment) =>
  adjustment.action === 'strips received'
    ? currentStock
      ? adjustment.actionPerformedAt >= currentStock.lastShipmentAt
        ? adjustment.actionPerformedAt
        : currentStock.lastShipmentAt
      : adjustment.actionPerformedAt
    : currentStock
      ? currentStock.lastShipmentAt
      : null;

const getLastStripsReceived = (currentStock, adjustment) =>
  adjustment.action === 'strips received'
    ? currentStock
      ? adjustment.actionPerformedAt >= currentStock.lastShipmentAt
        ? adjustment.stockChange
        : currentStock.numberOfStripsReceived
      : adjustment.stockChange
    : currentStock
      ? currentStock.numberOfStripsReceived
      : null;
