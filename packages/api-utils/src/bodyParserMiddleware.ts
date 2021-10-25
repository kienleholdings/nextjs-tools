import type { NextApiRequest } from 'next';
import { NextMiddleware } from 'next-api-middleware';

import apiResponse from './apiResponse';
import { SUPPORTED_CONTENT_TYPES, SUPPORTED_HTTP_METHODS } from './constants';

const methodsWithBodies = [
  SUPPORTED_HTTP_METHODS.PATCH,
  SUPPORTED_HTTP_METHODS.POST,
  SUPPORTED_HTTP_METHODS.PUT,
];

const MALFORMATTED_JSON_ERROR = 'JSON body is malformatted';

interface ParsedBody {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const handleJsonBody = (body: NextApiRequest['body']): ParsedBody => {
  if (!body) {
    return {};
  }
  if (typeof body === 'object') {
    return body;
  }
  if (typeof body === 'string') {
    // This might throw an error, so any method that calls this needs to be wrapped in a try catch
    return JSON.parse(body);
  }
  throw new Error(MALFORMATTED_JSON_ERROR);
};

const bodyParserMiddleware: NextMiddleware = async (req, res, next) => {
  if (methodsWithBodies.includes(req.method?.toLowerCase() ?? '')) {
    const contentType = req.headers['content-type'] || req.headers['Content-Type'];
    switch (contentType) {
      // Yeah these are the same function, however putting this switch in here allows us to keep our future options open
      case 'application/json':
      case 'application/x-www-form-urlencoded':
        try {
          const body = handleJsonBody(req.body);
          req.body = body;
          await next();
        } catch (err) {
          apiResponse.badRequest(res);
        }
        break;
      default:
        apiResponse.unsupportedMediaType(
          res,
          `content-type ${JSON.stringify(
            contentType
          )} is not supported. The following values are allowed: ${SUPPORTED_CONTENT_TYPES.join(
            ', '
          )}`
        );
    }
    return;
  }
  await next();
};

export default bodyParserMiddleware;
