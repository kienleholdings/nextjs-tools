import { CorsOptions } from 'cors';
import { label } from 'next-api-middleware';

import apiResponse from './apiResponse';
import bodyParserMiddleware from './bodyParserMiddleware';
import bodyValidatorMiddleware, { BodyValidationSchemas } from './bodyValidatorMiddleware';
import corsMiddleware from './corsMiddleware';
import createHandler from './createHandler';

interface MiddlewareConfig {
  bodyParserConfig?: string[];
  bodyValidatorConfig?: BodyValidationSchemas;
  corsConfig?: CorsOptions;
}

// I tried for a solid 45 minutes to be explicit about this return type, it was way more effort than it was worth
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const withMiddleware = ({
  bodyParserConfig,
  bodyValidatorConfig,
  corsConfig,
}: MiddlewareConfig = {}) =>
  label(
    {
      bodyParser: bodyParserMiddleware(bodyParserConfig),
      bodyValidator: bodyValidatorMiddleware(bodyValidatorConfig),
      cors: corsMiddleware(corsConfig),
    },
    ['bodyParser', 'bodyValidator', 'cors']
  );
const individualMiddleware = {
  bodyParserMiddleware,
  corsMiddleware,
};

export { apiResponse, individualMiddleware, createHandler, withMiddleware };
