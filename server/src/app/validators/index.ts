import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../controller/response.controller";


const runValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
      error: {
        name: "ValidationError",
        errors: errors.array(),
      }
    });
  } else {
    next();
  }

};

export default runValidation