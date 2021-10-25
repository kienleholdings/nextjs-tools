import { label } from 'next-api-middleware';

import apiResponse from './apiResponse';
import bodyParserMiddleware from './bodyParserMiddleware';
import createHandler from './createHandler';

const withMiddleware = label({ bodyParser: bodyParserMiddleware }, ['bodyParser']);
const individualMiddleware = {
  bodyParserMiddleware,
};

export { apiResponse, individualMiddleware, createHandler, withMiddleware };
