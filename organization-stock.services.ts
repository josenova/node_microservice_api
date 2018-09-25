// The service handles all the business logic.

import { Ec7OrganizationStockPostBody, OrganizationStock } from "./types";

import { HttpException, INVALID_PARAMETERS } from "../../modules/exceptions";

// GET /organizations/:id
// First get the model names and then search DB for stock by model ID.

export const configureGetOrganizationStockByIdService = (
  getOrganizationStockById,
  getEc7StripModels
) => (token, { organizationId, centerId }): Promise<OrganizationStock[]> =>
  getEc7StripModels(token, { centerId }).then(stripModels =>
    getOrganizationStockById({ organizationId }, stripModels)
  );

// POST /organizations/:id
// This is an example of cross domain validation needed on a microservice architecture.
// This endpoint recieves an ID of a model and needs to HTTP GET the models and validate the existence of that model.

export const configurePostOrganizationStockService = (
  postOrganizationStockRepo,
  getEc7StripModels
) => (
  token,
  query: Ec7OrganizationStockPostBody
): Promise<OrganizationStock[]> =>
  getEc7StripModels(token, { centerId: query.centerId })
    .then(
      stripModels =>
        stripModels.find(model => model.id === query.stripModelId)
          ? postOrganizationStockRepo(query, stripModels).catch(err =>
              Promise.reject(err)
            )
          : Promise.reject(
              HttpException(400, INVALID_PARAMETERS, "Invalid strip model id.")
            )
    )
    .catch(err => Promise.reject(err));
