"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomError = void 0;
const createCustomError = (message, statusCode = 400, errors) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.error = errors;
    return error;
};
exports.createCustomError = createCustomError;
