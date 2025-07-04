// utils/createCustomError.ts
import { CustomError } from "../types/customError";

export const createCustomError = (
  message: string,
  statusCode = 400,
  errors?: { errors?: { [key: string]: string | object | undefined; } | undefined; } | undefined
): CustomError => {
  const error = new Error(message) as CustomError;
  error.statusCode = statusCode;
  error.error = errors;
  return error;
};
