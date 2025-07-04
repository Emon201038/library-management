export interface CustomError extends Error {
  statusCode?: number;
  error?: { errors?: { [key: string]: string | object | undefined } }; // could be array, object, etc.
  errors?: object
}
