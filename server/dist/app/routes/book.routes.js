"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("../controller/book.controller");
const book_validator_1 = require("../validators/book.validator");
const validators_1 = __importDefault(require("../validators"));
const sanitizeBody_1 = __importDefault(require("../middlewares/sanitizeBody"));
const bookRouter = express_1.default.Router();
// http://localhost:3000/api/books
bookRouter.route("/")
    .get(book_controller_1.getBooks)
    .post(book_validator_1.validateCreateBook, validators_1.default, (0, sanitizeBody_1.default)(["author", "title", "genre", "isbn", "description", "publisher", "publishedYear", "language", "pages", "copies", "price", "available", "image"]), book_controller_1.createBook);
// http://localhost:3000/api/books/:bookId
bookRouter.route("/:bookId")
    .get(book_controller_1.getSingleBook)
    .put(book_controller_1.updateBook)
    .delete(book_controller_1.deleteBook);
exports.default = bookRouter;
