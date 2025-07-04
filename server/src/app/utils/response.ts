import { Response } from "express";

export interface IPayload<Data = object> {
  success?: boolean;
  message?: string;
  payload?: Data | null;
  statusCode?: number;
}

export interface IErrorResponse<TError = string> {
  success?: boolean;
  message?: string;
  statusCode?: number;
  error?: IErrorMessage<TError>;
}

export interface IErrorMessage<TError = string> {
  name: string;
  errors?: TError;
}

export const successResponse = <Data>(
  res: Response,
  {
    message = "Success",
    statusCode = 200,
    success = true,
    payload = null,
  }: IPayload<Data>
): Response => {
  return res.status(statusCode).json({
    success,
    message,
    data: payload,
  });
};

export const errorResponse = <TError>(
  res: Response,
  {
    message = "Error",
    statusCode = 400,
    success = false,
    error,
  }: IErrorResponse<TError>
): Response => {
  return res.status(statusCode).json({
    success,
    message,
    error,
  });
};
