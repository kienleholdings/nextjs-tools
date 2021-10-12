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

// TODO: Can we do this any better? There should be a way to DRY this up a bit but I can't think of it off the top of my head
const createHandler =
  ({ delete: deleteFunc, get, patch, post, put }: SupportedHandlers): HandlerFunc =>
  async (req, res) => {
    switch (req.method?.toLowerCase()) {
      case SUPPORTED_METHODS.DELETE:
        if (deleteFunc) {
          await deleteFunc(req, res);
          break;
        }
        apiResponse.methodNotAllowed(res);
        break;
      case SUPPORTED_METHODS.GET:
        if (get) {
          await get(req, res);
          break;
        }
        apiResponse.methodNotAllowed(res);
        break;
      case SUPPORTED_METHODS.PATCH:
        if (patch) {
          await patch(req, res);
          break;
        }
        apiResponse.methodNotAllowed(res);
        break;
      case SUPPORTED_METHODS.POST:
        if (post) {
          await post(req, res);
          break;
        }
        apiResponse.methodNotAllowed(res);
        break;
      case SUPPORTED_METHODS.PUT:
        if (put) {
          await put(req, res);
          break;
        }
        apiResponse.methodNotAllowed(res);
        break;
      default:
        apiResponse.methodNotAllowed(res);
    }
  };

export default createHandler;
