"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("../controller/book.controller");
// import { validateCreateBook } from "../validators/book.validator";
// import runValidation from "../validators";
const bookRouter = express_1.default.Router();
// http://localhost:3000/api/books
bookRouter.route("/")
    .get(book_controller_1.getBooks)
    .post(
// validateCreateBook, // this validation is commented out because it is not returning provided validation only mongoose return provided type error. 
// runValidation,
book_controller_1.createBook);
// http://localhost:3000/api/books/:bookId
bookRouter.route("/:bookId")
    .get(book_controller_1.getSingleBook)
    .put(book_controller_1.updateBook)
    .delete(book_controller_1.deleteBook);
exports.default = bookRouter;
