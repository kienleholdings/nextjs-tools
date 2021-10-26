import { CorsOptions } from 'cors';
import { label } from 'next-api-middleware';

import apiResponse from './apiResponse';
import bodyParserMiddleware from './bodyParserMiddleware';
import corsMiddleware from './corsMiddleware';
import createHandler from './createHandler';

interface MiddlewareConfig {
  bodyParserConfig?: string[];
  corsConfig?: CorsOptions;
}

// I tried for a solid 45 minutes to be explicit about this return type, it was way more effort than it was worth
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const withMiddleware = ({ bodyParserConfig, corsConfig }: MiddlewareConfig = {}) =>
  label({ bodyParser: bodyParserMiddleware(bodyParserConfig), cors: corsMiddleware(corsConfig) }, [
    'bodyParser',
    'cors',
  ]);
const individualMiddleware = {
  bodyParserMiddleware,
  corsMiddleware,
};

export { apiResponse, individualMiddleware, createHandler, withMiddleware };
