"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (res, { message = "Success", statusCode = 200, success = true, payload = null, }) => {
    return res.status(statusCode).json({
        success,
        message,
        data: payload,
    });
};
exports.successResponse = successResponse;
const errorResponse = (res, { message = "Error", statusCode = 400, success = false, error, }) => {
    return res.status(statusCode).json({
        success,
        message,
        error,
    });
};
exports.errorResponse = errorResponse;
