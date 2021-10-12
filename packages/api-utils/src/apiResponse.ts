import type { NextApiResponse } from 'next';

interface Data {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const errorResponse = (
  res: NextApiResponse,
  code: number,
  message = 'An unknown error has occurred, please try again later'
) => {
  res.status(code).json({ message });
};

const successResponse = (res: NextApiResponse, code: number, data: Data = { data: null }) => {
  res.status(code).json(data);
};

const apiResponse = {
  accepted: (res: NextApiResponse, data: Data): void => successResponse(res, 202, data),
  badRequest: (res: NextApiResponse, message = 'Bad Request'): void =>
    errorResponse(res, 400, message),
  created: (res: NextApiResponse, data: Data): void => successResponse(res, 201, data),
  forbidden: (res: NextApiResponse, message = 'Forbidden'): void =>
    errorResponse(res, 403, message),
  internalServerError: (res: NextApiResponse, message = 'Internal Server Error'): void =>
    errorResponse(res, 500, message),
  methodNotAllowed: (res: NextApiResponse, message = 'Method Not Allowed'): void =>
    errorResponse(res, 405, message),
  noContent: (res: NextApiResponse, data: Data): void => successResponse(res, 204, data),
  notFound: (res: NextApiResponse, message = 'Not Found'): void => errorResponse(res, 404, message),
  ok: (res: NextApiResponse, data: Data): void => successResponse(res, 200, data),
  unauthorized: (res: NextApiResponse, message = 'Unauthorized'): void =>
    errorResponse(res, 401, message),
  unprocessableEntity: (res: NextApiResponse, message = 'Unprocessable Entity'): void =>
    errorResponse(res, 422, message),
};

export default apiResponse;
