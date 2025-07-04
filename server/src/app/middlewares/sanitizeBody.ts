import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to strip unknown fields from req.body
 */
function stripUnknownFields(allowedFields: string[]) {
  return function (req: Request, res: Response, next: NextFunction): void {
    const sanitizedBody: Record<string, unknown> = {};

    for (const key of Object.keys(req.body)) {
      if (allowedFields.includes(key)) {
        sanitizedBody[key] = req.body[key];
      }
    }

    req.body = sanitizedBody;
    next();
  };
}

export default stripUnknownFields;
