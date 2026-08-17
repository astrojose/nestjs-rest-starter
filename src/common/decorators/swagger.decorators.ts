import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

/**
 * Decorator for endpoints that require Bearer JWT authentication.
 */
export const ApiBearerAuth = () => {
  return applyDecorators(ApiSecurity('JWT'));
};

/**
 * Decorator for paginated responses in Swagger docs.
 */
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model?: TModel,
) => {
  return applyDecorators(
    ...(model ? [ApiExtraModels(model)] : []),
    ApiOkResponse({
      schema: {
        properties: {
          status: { type: 'number', example: 200 },
          message: { type: 'string', example: 'Success' },
          timestamp: { type: 'string', format: 'date-time' },
          path: { type: 'string', example: '/api/v1/resources' },
          data: {
            type: 'array',
            items: model ? { $ref: getSchemaPath(model) } : { type: 'object' },
          },
          pagination: {
            type: 'object',
            properties: {
              total: { type: 'number', example: 100 },
              totalPages: { type: 'number', example: 10 },
              currentPage: { type: 'number', example: 1 },
              pageSize: { type: 'number', example: 10 },
              totalItems: { type: 'number', example: 100 },
              itemsPerPage: { type: 'number', example: 10 },
            },
          },
        },
      },
    }),
  );
};

const standardResponseSchema = {
  properties: {
    status: { type: 'number', example: 200 },
    message: { type: 'string', example: 'Success' },
    timestamp: { type: 'string', format: 'date-time' },
    path: { type: 'string', example: '/api/v1/resource' },
  },
};

const standardErrorResponseProperties = {
  status: { type: 'number' },
  code: { type: 'string' },
  message: { type: 'string' },
  timestamp: { type: 'string', format: 'date-time' },
  path: { type: 'string' },
};

const getStandardDataResponseSchema = <TModel extends Type<any>>(
  model?: TModel,
) => {
  return {
    properties: {
      ...standardResponseSchema.properties,
      data: model ? { $ref: getSchemaPath(model) } : { type: 'object' },
    },
  };
};

/**
 * Decorator for standard 200 OK responses in Swagger.
 */
export const ApiStandardResponse = <TModel extends Type<any>>(
  model?: TModel,
) => {
  return applyDecorators(
    ...(model ? [ApiExtraModels(model)] : []),
    ApiOkResponse({
      schema: getStandardDataResponseSchema(model),
    }),
  );
};

/**
 * Decorator for 201 Created responses in Swagger.
 */
export const ApiCreatedStandardResponse = <TModel extends Type<any>>(
  resourceName: string,
  model?: TModel,
) => {
  return applyDecorators(
    ...(model ? [ApiExtraModels(model)] : []),
    ApiCreatedResponse({
      description: `${resourceName} created successfully`,
      schema: getStandardDataResponseSchema(model),
    }),
  );
};

/**
 * Decorator for 202 Accepted responses in Swagger.
 */
export const ApiAcceptedStandardResponse = <TModel extends Type<any>>(
  resourceName: string,
  model?: TModel,
) => {
  return applyDecorators(
    ...(model ? [ApiExtraModels(model)] : []),
    ApiAcceptedResponse({
      description: `${resourceName} operation accepted`,
      schema: getStandardDataResponseSchema(model),
    }),
  );
};

/**
 * Decorator for updated resources responses (200) in Swagger.
 */
export const ApiUpdatedResponse = <TModel extends Type<any>>(
  resourceName: string,
  model?: TModel,
) => {
  return applyDecorators(
    ...(model ? [ApiExtraModels(model)] : []),
    ApiResponse({
      status: 200,
      description: `${resourceName} updated successfully`,
      schema: getStandardDataResponseSchema(model),
    }),
  );
};

/**
 * Decorator for deleted responses (200) in Swagger.
 */
export const ApiDeletedResponse = (resourceName: string) => {
  return applyDecorators(
    ApiOkResponse({
      description: `${resourceName} deleted successfully`,
      schema: {
        properties: {
          ...standardResponseSchema.properties,
          message: {
            type: 'string',
            example: `${resourceName} deleted successfully`,
          },
          data: { type: 'null', example: null },
        },
      },
    }),
  );
};

/**
 * Decorator for 404 Not Found responses in Swagger.
 */
export const ApiNotFoundStandardResponse = (resourceName: string) => {
  return applyDecorators(
    ApiNotFoundResponse({
      description: `${resourceName} not found`,
      schema: {
        properties: {
          ...standardErrorResponseProperties,
          message: { type: 'string', example: `${resourceName} not found` },
          code: { type: 'string', example: 'NOT_FOUND' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
};

/**
 * Decorator for 400 Bad Request responses in Swagger.
 */
export const ApiBadRequestStandardResponse = (resourceName: string) => {
  return applyDecorators(
    ApiBadRequestResponse({
      description: `Invalid ${resourceName.toLowerCase()} request data`,
      schema: {
        properties: {
          ...standardErrorResponseProperties,
          message: { type: 'string', example: 'Validation failed' },
          code: { type: 'string', example: 'BAD_REQUEST' },
          error: { type: 'object' },
        },
      },
    }),
  );
};

/**
 * Decorator for 401 Unauthorized responses in Swagger.
 */
export const ApiUnauthorizedStandardResponse = () => {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
      schema: {
        properties: {
          ...standardErrorResponseProperties,
          message: { type: 'string', example: 'Unauthorized access' },
          code: { type: 'string', example: 'UNAUTHORIZED' },
          error: { type: 'string', example: 'Unauthorized' },
        },
      },
    }),
  );
};

/**
 * Decorator for 403 Forbidden responses in Swagger.
 */
export const ApiForbiddenStandardResponse = () => {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Access forbidden',
      schema: {
        properties: {
          ...standardErrorResponseProperties,
          message: { type: 'string', example: 'Access forbidden' },
          code: { type: 'string', example: 'FORBIDDEN' },
          error: { type: 'string', example: 'Forbidden' },
        },
      },
    }),
  );
};

/**
 * Combined decorator for standard CRUD operations in Swagger.
 */
export const ApiCrudResponses = <TModel extends Type<any> = any>(
  resourceName: string,
  model?: TModel,
) => {
  return applyDecorators(
    ApiStandardResponse(model),
    ApiNotFoundStandardResponse(resourceName),
    ApiBadRequestStandardResponse(resourceName),
    ApiUnauthorizedStandardResponse(),
  );
};

/**
 * Decorator for standard pagination query parameters in Swagger docs.
 */
export const ApiPaginationQueries = () => {
  return applyDecorators(
    ApiQuery({
      name: 'q',
      required: false,
      description: 'Search query for filtering resources',
      type: String,
    }),
    ApiQuery({
      name: 'currentPage',
      required: false,
      description: 'Page number for pagination (1-indexed)',
      type: Number,
      example: 1,
    }),
    ApiQuery({
      name: 'pageSize',
      required: false,
      description: 'Number of items per page',
      type: Number,
      example: 10,
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      description: 'Field to sort by',
      type: String,
      example: 'createdAt',
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      description: 'Sort direction (asc or desc)',
      type: String,
      enum: ['asc', 'desc'],
      example: 'desc',
    }),
  );
};
