// Validation using Joi

import {
  validateSchemaFactory,
  validIsoDateTime,
  validNumber,
  validString,
} from '../../common/global.validations'; // Common Joi.js validation functions


export const organizationStockGetQueryValidator = (obj) =>
  validateSchemaFactory('get-organization-stock', {
    centerId: validNumber.required(),
    organizationId: validNumber.required(),
  })(obj);

export const organizationStockDeleteQueryValidator = (obj) =>
  validateSchemaFactory(
    'delete-organization-stock',
    organizationStockPostQuerySchema,
  )(obj);

export const organizationStockPostQueryValidator = (obj) =>
  validateSchemaFactory(
    'post-organization-stock',
    organizationStockPostQuerySchema,
  )(obj);

const organizationStockPostQuerySchema = {
  action: validString.required(),
  actionPerformedAt: validIsoDateTime.required(),
  centerId: validNumber.required(),
  numberOfItems: validNumber.required(),
  organizationId: validNumber.required(),
  modelId: validNumber.required(),
};


