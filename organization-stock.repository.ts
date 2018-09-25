// Repository functions use adapter functions to fetch data: db queries, http calls, etc... and then 
// transforms the data as required by the service for its use.

import {
  DbOrganizationStock,
  Ec7OrganizationStockPostBody,
  OrganizationStock,
  Merge,
  StripModel,
  StripModelGetQuery,
  Ec7StripModel
} from "./types";

import { DatabaseClient, FindAllByFilter } from "../../modules/db-helpers";

import { throw404IfEmpty, RepositoryException, NOT_FOUND } from "../../modules/exceptions";

import { HttpGetAllByFilter } from '../../../modules/ec7-helpers'; // Http request helper

// 

type ConfigureReadOrganizationStockRepo = (
  db: DatabaseClient,
  transformFromDb: Merge<
    DbOrganizationStock,
    Ec7StripModel[],
    OrganizationStock
  >
) => (
  { organizationId },
  ec7StripModels: Ec7StripModel[]
) => Promise<OrganizationStock[]>;

export const configureReadOrganizationStockRepo: ConfigureReadOrganizationStockRepo = (
  db,
  transformFromDbOrganizationStock
) => ({ organizationId }, ec7StripModels) =>
  FindAllByFilter<DbOrganizationStock>(db, "OrganizationStock", {
    organizationId
  })
    .then(throw404IfEmpty)
    .then(organizationStocks =>
      organizationStocks.map(stock =>
        transformFromDbOrganizationStock(stock, ec7StripModels)
      )
    );

//

type ConfigureCreateOrganizationStockRepo = (
  db: DatabaseClient,
  createOrganizationStock,
  transformFromDb: Merge<
    DbOrganizationStock,
    Ec7StripModel[],
    OrganizationStock
  >
) => (
  query: Ec7OrganizationStockPostBody,
  ec7StripModels: Ec7StripModel[]
) => Promise<OrganizationStock[]>;

export const configureCreateOrganizationStockRepo: ConfigureCreateOrganizationStockRepo = (
  db,
  createOrganizationStock,
  transformFromDbOrganizationStock
) => (query, ec7StripModels) =>
  createOrganizationStock(db, query).then(organizationStocks =>
    organizationStocks.map(stock =>
      transformFromDbOrganizationStock(stock, ec7StripModels)
    )
  );

  //

  type GetEc7StripModels = (
    settings: any,
  ) => (token: string, query: StripModelGetQuery) => Promise<StripModel[]>;
  
  export const getStripModels: GetEc7StripModels = settings => (
    token,
    { centerId },
  ) =>
    HttpGetAllByFilter<any, StripModel>(
      { ...settings, token },
      `strip-models/?centerId=${centerId}`,
      {},
    ).then(models => {
      return models
        ? Promise.resolve(models)
        : Promise.reject(RepositoryException(404, NOT_FOUND)); // Raise 404 if model not found
    });
  