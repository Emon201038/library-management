"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Middleware to strip unknown fields from req.body
 */
function stripUnknownFields(allowedFields) {
    return function (req, res, next) {
        const sanitizedBody = {};
        for (const key of Object.keys(req.body)) {
            if (allowedFields.includes(key)) {
                sanitizedBody[key] = req.body[key];
            }
        }
        req.body = sanitizedBody;
        next();
    };
}
exports.default = stripUnknownFields;
