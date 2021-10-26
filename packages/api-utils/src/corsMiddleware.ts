import { CorsOptions } from 'cors';
import nextCors from 'nextjs-cors';
import { NextMiddleware } from 'next-api-middleware';

const corsMiddleware =
  (corsConfig?: CorsOptions): NextMiddleware =>
  async (req, res, next) => {
    await nextCors(req, res, corsConfig);

    if (req.method?.toLowerCase() !== 'options') {
      await next();
    }
  };

export default corsMiddleware;
