export const throwGenericError = (name: string, message: string, field: string, value: string, statusCode: number = 500, type: string = "string") => {
  throw {
    name: name,
    message: message,
    statusCode: statusCode,
    errors: {
      [field]: {
        message,
        properties: {
          message,
          type: typeof value
        },
        path: field,
        kind: type,
        value,
      },
    },
  }
};