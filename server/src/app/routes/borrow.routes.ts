import express from "express";
import { borrowBook, deleteBorrowBook, getBorrowedBooks, getSingleBorrowBook, updateBorrowBook } from "../controller/borrow.controller";

const borrowRouter = express.Router();

// http://localhost:3000/api/borrow
borrowRouter.route("/")
  .get(getBorrowedBooks)
  .post(borrowBook);

// http://localhost:3000/api/borrow/:borrowId
borrowRouter.route("/:borrowId")
  .get(getSingleBorrowBook)
  .put(updateBorrowBook)
  .delete(deleteBorrowBook);

export default borrowRouter