"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const response_controller_1 = require("../controller/response.controller");
const runValidation = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        (0, response_controller_1.errorResponse)(res, {
            statusCode: 400,
            message: errors.array()[0].msg,
            error: {
                name: "ValidationError",
                errors: errors.array(),
            }
        });
    }
    else {
        next();
    }
};
exports.default = runValidation;
