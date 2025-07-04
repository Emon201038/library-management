// middlewares/errorHandler.ts
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response";
import { CustomError } from "../types/customError";

export const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction) => {
  const NODE_ENV = process.env.NODE_ENV ?? "development";

  if (NODE_ENV === "development") {
    console.error("💥 Error:", JSON.stringify(err));
  }
  const { name, ...restErr } = err
  errorResponse<unknown>(res, {
    statusCode: err.statusCode ?? 500,
    message: err.message ?? "Internal server error",
    error: {
      name: name,
      errors: restErr!.errors,
    },
  });
};
