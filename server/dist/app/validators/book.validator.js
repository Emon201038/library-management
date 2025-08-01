"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateBook = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateBook = [
    (0, express_validator_1.body)("title")
        .notEmpty()
        .withMessage("Title is required")
        .isString()
        .withMessage("title must be a string"),
    (0, express_validator_1.body)("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    (0, express_validator_1.body)("author")
        .notEmpty()
        .withMessage("Author is required")
        .isString()
        .withMessage("author must be a string"),
    (0, express_validator_1.body)("genre")
        .notEmpty()
        .withMessage("genre is required")
        .isString()
        .withMessage("genre must be a string"),
    (0, express_validator_1.body)("isbn")
        .notEmpty()
        .withMessage("ISBN is required")
        .isNumeric()
        .withMessage("ISBN must be a number"),
    (0, express_validator_1.body)("copies")
        .notEmpty()
        .withMessage("copies is required")
        .isNumeric()
        .withMessage("Copies must be a number")
        .isInt({ min: 0 })
        .withMessage("Copies must be greater a positive number"),
    (0, express_validator_1.body)("available")
        .optional()
        .isBoolean()
        .withMessage("Available must be a boolean"),
    (0, express_validator_1.body)("image")
        .optional(),
    (0, express_validator_1.body)("price")
        .optional()
        .isString()
        .withMessage("Price must be a string"),
    (0, express_validator_1.body)("publishedYear")
        .optional()
        .isNumeric()
        .withMessage("Published year must be a number"),
    (0, express_validator_1.body)("publisher")
        .optional()
        .isString()
        .withMessage("Publisher must be a string"),
    (0, express_validator_1.body)("pages")
        .optional()
        .isNumeric()
        .withMessage("Pages must be a number"),
    // body("language")
    //   .optional()
    //   .isString()
    //   .withMessage("Language must be a string"),
];
