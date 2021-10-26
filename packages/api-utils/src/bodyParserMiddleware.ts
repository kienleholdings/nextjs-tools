import type { NextApiRequest } from 'next';
import { NextMiddleware } from 'next-api-middleware';

import apiResponse from './apiResponse';
import {
  DEFAULT_CONTENT_TYPES,
  SUPPORTED_CONTENT_TYPES,
  SUPPORTED_HTTP_METHODS,
} from './constants';

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

const bodyParserMiddleware =
  (allowedContentTypes = DEFAULT_CONTENT_TYPES): NextMiddleware =>
  async (req, res, next) => {
    // If content-type is passed in as an array then this will fail regardless, I'm comfortable casting this
    const contentType = (req.headers['content-type'] || req.headers['Content-Type']) as string;
    if (methodsWithBodies.includes(req.method?.toLowerCase() ?? '')) {
      if (!allowedContentTypes.includes(contentType)) {
        apiResponse.unsupportedMediaType(
          res,
          `content-type ${JSON.stringify(
            contentType
          )} is not supported. The following values are allowed: ${allowedContentTypes.join(', ')}`
        );
        return;
      }
      if (
        [
          SUPPORTED_CONTENT_TYPES.APPLICATION_JSON,
          SUPPORTED_CONTENT_TYPES.APPLICATION_FORM_URLENCODED,
        ].includes(contentType)
      ) {
        try {
          const body = handleJsonBody(req.body);
          req.body = body;
          await next();
        } catch (err) {
          apiResponse.badRequest(res);
        }
      }
    }
    await next();
  };

export default bodyParserMiddleware;
