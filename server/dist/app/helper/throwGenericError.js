"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwGenericError = void 0;
const throwGenericError = (name, message, field, value, statusCode = 500, type = "string") => {
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
    };
};
exports.throwGenericError = throwGenericError;
