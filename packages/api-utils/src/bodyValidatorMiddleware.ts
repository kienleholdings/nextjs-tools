import { NextMiddleware } from 'next-api-middleware';
import { SchemaOf } from 'yup';

import apiResponse from './apiResponse';
import { METHODS_WITH_BODIES } from './constants';

// We don't want to enforce any specific Yup pattern, just that it's a schema
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Schema = SchemaOf<any>;

export interface BodyValidationSchemas {
  patch?: Schema;
  post?: Schema;
  put?: Schema;
}

const bodyValidatorMiddleware =
  (bodyValidationSchemas: BodyValidationSchemas = {}): NextMiddleware =>
  async (req, res, next) => {
    const method = req.method?.toLowerCase() ?? '';

    // We're casting this to any here as TypeScript should ensure we don't pass validators for HTTP
    // methods with no request bodies. We also have guards down below to ensure nothing happens if
    // there's no match between the validators and current HTTP method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentValidator: Schema | undefined = (bodyValidationSchemas as any)[method];
    if (METHODS_WITH_BODIES.includes(method) && currentValidator) {
      try {
        await currentValidator.validate(req.body);
        req.body = currentValidator.cast(req.body);
      } catch (err) {
        const errMessage =
          err?.errors?.join('. ') ??
          "Your request's body was malformatted, however we don't have an error to show. Please refer to the API's documentation and double check your request";
        apiResponse.unprocessableEntity(res, errMessage);
        return;
      }
    }
    await next();
  };

export default bodyValidatorMiddleware;
