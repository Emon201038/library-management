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
exports.deleteBorrowBook = exports.updateBorrowBook = exports.getSingleBorrowBook = exports.borrowBook = exports.getBorrowedBooks = void 0;
const response_controller_1 = require("./response.controller");
const borrow_model_1 = __importDefault(require("../models/borrow.model"));
const throwGenericError_1 = require("../helper/throwGenericError");
const book_model_1 = __importDefault(require("../models/book.model"));
const getBorrowedBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield borrow_model_1.default.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "book",
                    foreignField: "_id",
                    as: "book"
                }
            },
            {
                $unwind: "$book"
            },
            {
                $group: {
                    _id: "$book._id",
                    book: { $first: "$book" },
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$book.title",
                        isbn: "$book.isbn"
                    },
                    totalQuantity: 1
                }
            }
        ]);
        (0, response_controller_1.successResponse)(res, { message: "Borrowed books summary retrieved successfully.", success: true, payload: books });
    }
    catch (error) {
        next(error);
    }
});
exports.getBorrowedBooks = getBorrowedBooks;
const borrowBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongooseIdRegx = /^[0-9a-fA-F]{24}$/;
        if (!mongooseIdRegx.test(req.body.book)) {
            // throw generic error as assignment requirement
            throw (0, throwGenericError_1.throwGenericError)("InvalidMongooseID", "Invalid book id. Please provide a valid book id.", "book", req.body.book, 400, "ObjectID");
        }
        const isBookExists = yield book_model_1.default.exists({ _id: req.body.book });
        if (!isBookExists) {
            throw {
                statusCode: 404,
                message: "Book is not found.",
            };
        }
        ;
        // check if book is available
        const isAvailable = yield book_model_1.default.isBookAvailable(req.body.book, req.body.quantity);
        if (!isAvailable) {
            throw {
                statusCode: 400,
                message: "Book is not available.",
            };
        }
        const borrow = yield borrow_model_1.default.create(req.body);
        if (!borrow) {
            throw {
                statusCode: 400,
                message: "Failed to borrow this book.",
            };
        }
        ;
        // updating book copies after borrow
        yield book_model_1.default.updateCopies(borrow.book, borrow.quantity);
        (0, response_controller_1.successResponse)(res, { message: "Book borrowed successfully.", success: true, statusCode: 201, payload: borrow });
    }
    catch (error) {
        next(error);
    }
});
exports.borrowBook = borrowBook;
const getSingleBorrowBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrowId = req.params.borrowId;
        const mongooseIdRegx = /^[0-9a-fA-F]{24}$/;
        if (!mongooseIdRegx.test(borrowId)) {
            // throw generic error as assignment requirement
            throw (0, throwGenericError_1.throwGenericError)("InvalidMongooseID", "Invalid book id. Please provide a valid book id.", "borrowId", borrowId, 400, "ObjectID");
        }
        ;
        const borrow = yield borrow_model_1.default.findById(borrowId).populate("book").lean();
        if (!borrow) {
            throw {
                statusCode: 404,
                message: "Borrow is not found.",
            };
        }
        ;
        (0, response_controller_1.successResponse)(res, { message: "Borrowed book is found successfully.", success: true, payload: borrow });
    }
    catch (error) {
        next(error);
    }
});
exports.getSingleBorrowBook = getSingleBorrowBook;
const updateBorrowBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrowId = req.params.borrowId;
        const mongooseIdRegx = /^[0-9a-fA-F]{24}$/;
        if (!mongooseIdRegx.test(borrowId)) {
            // throw generic error as assignment requirement
            throw (0, throwGenericError_1.throwGenericError)("InvalidMongooseID", "Invalid book id. Please provide a valid book id.", "borrowId", borrowId, 400, "ObjectID");
        }
        ;
        const borrow = yield borrow_model_1.default.findById(borrowId);
        if (!borrow) {
            throw {
                statusCode: 404,
                message: "Borrow is not found.",
            };
        }
        ;
        const checkQuantity = yield book_model_1.default.isBookAvailable(borrow.book, (Number(req.body.quantity) - borrow.quantity));
        if (!checkQuantity) {
            throw {
                statusCode: 400,
                message: "Book quantity is not enough.",
            };
        }
        ;
        const updatedBorrow = yield borrow_model_1.default.findByIdAndUpdate(borrowId, { quantity: req.body.quantity }, { new: true });
        if (!updatedBorrow) {
            throw {
                statusCode: 400,
                message: "Failed to update this book.",
            };
        }
        ;
        yield book_model_1.default.updateCopies(updatedBorrow.book, updatedBorrow.quantity - borrow.quantity);
        (0, response_controller_1.successResponse)(res, { message: "Borrowed book is updated successfully.", success: true, payload: updatedBorrow });
    }
    catch (error) {
        next(error);
    }
});
exports.updateBorrowBook = updateBorrowBook;
const deleteBorrowBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrowId = req.params.borrowId;
        const mongooseIdRegx = /^[0-9a-fA-F]{24}$/;
        if (!mongooseIdRegx.test(borrowId)) {
            // throw generic error as assignment requirement
            throw (0, throwGenericError_1.throwGenericError)("InvalidMongooseID", "Invalid book id. Please provide a valid book id.", "borrowId", borrowId, 400, "ObjectID");
        }
        ;
        const borrow = yield borrow_model_1.default.findByIdAndDelete(borrowId);
        if (!borrow) {
            throw {
                statusCode: 404,
                message: "Borrow is not found.",
            };
        }
        ;
        yield book_model_1.default.updateCopies(borrow.book, -borrow.quantity);
        (0, response_controller_1.successResponse)(res, { message: "Borrowed book is deleted successfully.", success: true });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteBorrowBook = deleteBorrowBook;
