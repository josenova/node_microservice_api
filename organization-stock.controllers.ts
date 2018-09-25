// The controller is in charge of fetching the request params and 
// validating any user input.

import { Request, Response } from 'express';

// GET organizations/:id

export const getOrganizationStockByIdController = (
  getOrganizationStockByIdService,
  organizationStockGetQueryValidator,
  transformIntoEc7OrganizationStockList,
) => (req: Request, res: Response, next) => {

  const { organizationId } = req.params;
  organizationStockGetQueryValidator({
    centerId: res.locals.user.centerId,
    organizationId,
  })
    .then(query => getOrganizationStockByIdService(res.locals.token, query))
    .then(transformIntoEc7OrganizationStockList)
    .then(data => res.json(data))
    .catch(err => next(err));
};

// POST organizations/:id/deliveries

export const postOrganizationStockStripDeliveryController = (
  postOrganizationStockStripDeliveryService,
  organizationStockPostQueryValidator,
  transformIntoEc7OrganizationStockList,
) => (req: Request, res: Response, next) => {

  const { organizationId } = req.params;
  const { actionPerformedAt, stripModelId, numberOfStrips } = req.body;
  organizationStockPostQueryValidator({
    action: 'strips delivered',
    actionPerformedAt,
    centerId: res.locals.user.centerId, // User props are stored in redis on authentication
    hcpId: res.locals.user.id,
    numberOfStrips,
    organizationId,
    stripModelId,
  })
    .then(query =>
      postOrganizationStockStripDeliveryService(res.locals.token, query),
    )
    .then(transformIntoEc7OrganizationStockList)
    .then(data => res.json(data))
    .catch(err => next(err)); // Errors are catched and handled on their own Express router layer.
};

// POST organizations/:id/recieves

export const postOrganizationStockStripReceiveController = (
  postOrganizationStockStripReceiveService,
  organizationStockPostQueryValidator,
  transformIntoEc7OrganizationStockList,
) => (req: Request, res: Response, next) => {

  const { organizationId } = req.params;
  const { actionPerformedAt, stripModelId, numberOfStrips } = req.body;
  organizationStockPostQueryValidator({
    action: 'strips received',
    actionPerformedAt,
    centerId: res.locals.user.centerId,
    hcpId: res.locals.user.id,
    numberOfStrips,
    organizationId,
    stripModelId,
  })
    .then(query =>
      postOrganizationStockStripReceiveService(res.locals.token, query),
    )
    .then(transformIntoEc7OrganizationStockList)
    .then(data => res.json(data))
    .catch(err => next(err));
};

// DELETE organizations/:id/deliveries
// Reverts any delivery that failed to be processed on the patient stock service.

export const deleteOrganizationStockStripDeliveryController = (
  deleteOrganizationStockStripDeliveryService,
  organizationStockDeleteQueryValidator,
  transformIntoEc7OrganizationStock,
) => (req: Request, res: Response, next) => {

  const { organizationId } = req.params;
  const { actionPerformedAt, stripModelId, numberOfStrips } = req.body;
  organizationStockDeleteQueryValidator({
    action: 'strips delivered reversal',
    actionPerformedAt,
    centerId: res.locals.user.centerId,
    hcpId: res.locals.user.id,
    numberOfStrips,
    organizationId,
    stripModelId,
  })
    .then(query =>
      deleteOrganizationStockStripDeliveryService(res.locals.token, query),
    )
    .then(transformIntoEc7OrganizationStock)
    .then(data => res.json(data))
    .catch(err => next(err));
};