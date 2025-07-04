"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (res, { message = "success", statusCode = 200, success = true, payload = null }) => {
    return res.status(statusCode).json({ success: success, message: message, data: payload });
};
exports.successResponse = successResponse;
const errorResponse = (res, { message = "error", statusCode = 400, success = false, error }) => {
    return res.status(statusCode).json({
        success: success,
        message: message,
        error: error
    });
};
exports.errorResponse = errorResponse;
