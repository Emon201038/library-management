"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const borrow_controller_1 = require("../controller/borrow.controller");
const borrowRouter = express_1.default.Router();
// http://localhost:3000/api/borrow
borrowRouter.route("/")
    .get(borrow_controller_1.getBorrowedBooks)
    .post(borrow_controller_1.borrowBook);
// http://localhost:3000/api/borrow/:borrowId
borrowRouter.route("/:borrowId")
    .get(borrow_controller_1.getSingleBorrowBook)
    .put(borrow_controller_1.updateBorrowBook)
    .delete(borrow_controller_1.deleteBorrowBook);
exports.default = borrowRouter;
