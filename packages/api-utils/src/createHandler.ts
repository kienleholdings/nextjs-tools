import type { NextApiResponse, NextApiRequest } from 'next';

import apiResponse from './apiResponse';

// eslint-disable-next-line no-unused-vars
type HandlerFunc = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

const SUPPORTED_METHODS = {
  DELETE: 'delete',
  GET: 'get',
  PATCH: 'patch',
  POST: 'post',
  PUT: 'put',
};

interface SupportedHandlers {
  delete?: HandlerFunc;
  get?: HandlerFunc;
  patch?: HandlerFunc;
  post?: HandlerFunc;
  put?: HandlerFunc;
}

// We don't care what the user's logger func takes or returns, we just care if they have one and
// we can call it
// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
type LoggerFunc = (...args: any[]) => any;

const createHandler =
  (
    { delete: deleteFunc, get, patch, post, put }: SupportedHandlers,
    loggerFunc?: LoggerFunc
  ): HandlerFunc =>
  async (req, res) => {
    const methodsWithHandlers = {
      delete: deleteFunc,
      get,
      patch,
      post,
      put,
      // We're casting methodsWithHandlers as any here to make TypeScript happy. We've already
      // verified before it's called that the method can only be an allowed option, so casting it
      // to any doesn't cause any major issues
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const lowerCaseMethod = req?.method?.toLowerCase() ?? '';

    if (
      !req.method ||
      !Object.values(SUPPORTED_METHODS).includes(lowerCaseMethod) ||
      !methodsWithHandlers[lowerCaseMethod]
    ) {
      apiResponse.methodNotAllowed(res);
      return;
    }

    try {
      await methodsWithHandlers[lowerCaseMethod](req, res);
    } catch (err) {
      if (loggerFunc) {
        loggerFunc(err, {
          body: req.body,
          headers: req.headers,
          method: req.method,
          query: req.query,
          url: req.url,
        });
      }
      apiResponse.internalServerError(res);
    }
  };

export default createHandler;
