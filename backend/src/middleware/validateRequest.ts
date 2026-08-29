import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

export function validateRequest(
  schema:
    | AnyZodObject
    | {
        body?: AnyZodObject;
        query?: AnyZodObject;
        params?: AnyZodObject;
      }
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if ('parseAsync' in schema) {
        const parsed = await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        if (parsed.body) req.body = parsed.body;
        if (parsed.query) req.query = parsed.query;
        if (parsed.params) req.params = parsed.params;
      } else {
        if (schema.body) {
          req.body = await schema.body.parseAsync(req.body);
        }
        if (schema.query) {
          req.query = await schema.query.parseAsync(req.query);
        }
        if (schema.params) {
          req.params = await schema.params.parseAsync(req.params);
        }
      }
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        return next(new ValidationError('Invalid request payload', formattedErrors));
      }
      return next(error);
    }
  };
}
