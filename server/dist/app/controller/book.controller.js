"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getSingleBook = exports.createBook = exports.getBooks = void 0;
const response_controller_1 = require("./response.controller");
const book_model_1 = __importDefault(require("../models/book.model"));
const throwGenericError_1 = require("../helper/throwGenericError");
const getBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sortBy = "createdAt", sort = "desc", limit = 10, filter, search, page = 1 } = req.query;
        const filterKeyword = {};
        if (filter) {
            filterKeyword.genre = { $in: filter.split(",").map((genre) => genre.toUpperCase()) }; //multiple genre filtering support
        }
        ;
        if (search) {
            filterKeyword.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    author: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }
        ;
        let resMessage = "Books retrieved  successfully.";
        const books = yield book_model_1.default
            .find(filterKeyword)
            .sort({ [sortBy]: (sort === "desc" || sort === "descending") ? -1 : 1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        if (books.length === 0) {
            resMessage = "No Books are found.";
        }
        (0, response_controller_1.successResponse)(res, { message: resMessage, success: true, payload: books });
    }
    catch (error) {
        next(error);
    }
});
exports.getBooks = getBooks;
const createBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const book = yield book_model_1.default.create(body);
        (0, response_controller_1.successResponse)(res, { message: "Book created successfully.", success: true, statusCode: 201, payload: book });
    }
    catch (error) {
        next(error);
    }
});
exports.createBook = createBook;
const getSingleBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const mongooseIdRegx = /^[0-9a-fA-F]{24}$/;
        if (!mongooseIdRegx.test(bookId)) {
            // throw generic error as assignment requirement
            throw (0, throwGenericError_1.throwGenericError)("InvalidMongooseID", "Invalid book id. Please provide a valid book id.", "bookId", bookId);
        }
        const book = yield book_model_1.default.findById(bookId);
        if (!book) {
            throw {
                statusCode: 404,
                message: "Book is not found.",
            };
        }
        (0, response_controller_1.successResponse)(res, {
            success: true,
            message: "Book retrieved successfully.",
            payload: book
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getSingleBook = getSingleBook;
const updateBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const mongooseIdRegx = /^[0-9a-fA-F]{24}$/;
        if (!mongooseIdRegx.test(bookId)) {
            // throw generic error as assignment requirement
            throw (0, throwGenericError_1.throwGenericError)("InvalidMongooseID", "Invalid book id. Please provide a valid book id.", "bookId", bookId);
        }
        ;
        const allowedFields = {
            title: "string",
            author: "string",
            genre: "string",
            description: "string",
            copies: "number",
            isbn: "number",
            available: "boolean"
        };
        if (!req.body || Object.keys(req.body).length === 0) {
            throw {
                statusCode: 400,
                message: "At least one field is required.",
            };
        }
        for (const [key, value] of Object.entries(req.body)) {
            // Check if the field is allowed
            if (!(key in allowedFields)) {
                throw {
                    statusCode: 400,
                    message: `Invalid field. '${key}' is not allowed.`,
                };
            }
            // Check type
            const expectedType = allowedFields[key];
            if (typeof value !== expectedType) {
                const message = `Invalid type for field '${key}'. Expected ${expectedType}, got ${typeof value}.`;
                throw (0, throwGenericError_1.throwGenericError)("InvalidType", message, key, value, 400, "number");
            }
        }
        ;
        const book = yield book_model_1.default.findByIdAndUpdate(bookId, {
            $set: req.body
        }, {
            new: true, runValidators: true
        });
        // Check if book is not found
        if (!book) {
            throw {
                statusCode: 404,
                message: "Book is not found.",
            };
        }
        (0, response_controller_1.successResponse)(res, { message: "Book updated successfully.", success: true, payload: book });
    }
    catch (error) {
        next(error);
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const mongooseIdRegx = /^[0-9a-fA-F]{24}$/;
        if (!mongooseIdRegx.test(bookId)) {
            // throw generic error as assignment requirement
            throw (0, throwGenericError_1.throwGenericError)("InvalidMongooseID", "Invalid book id. Please provide a valid book id.", "bookId", bookId);
        }
        ;
        const book = yield book_model_1.default.findByIdAndDelete(bookId);
        if (!book) {
            throw {
                statusCode: 404,
                message: "Book is not found.",
            };
        }
        (0, response_controller_1.successResponse)(res, { message: "Book deleted successfully.", success: true });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteBook = deleteBook;
