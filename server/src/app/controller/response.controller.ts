import { Response } from "express";

interface IPayload<Data = null> {
  success?: boolean;
  message?: string;
  payload?: Data | null;
  statusCode?: number;
}
interface IErrorResponse<TError> {
  success?: boolean;
  message?: string;
  statusCode?: number;
  error: IErrorMessage<TError>
}
interface IErrorMessage<IError> {
  name: string;
  errors: IError
}


export const successResponse = <Data>(res: Response, {
  message = "success",
  statusCode = 200,
  success = true,
  payload = null }: IPayload<Data>): IPayload => {
  return res.status(statusCode).json({ success: success, message: message, data: payload })
}

export const errorResponse = <TError>(res: Response,
  {
    message = "error",
    statusCode = 400,
    success = false,
    error
  }: IErrorResponse<TError>) => {
  return res.status(statusCode).json({
    success: success,
    message: message,
    error: error
  });
}