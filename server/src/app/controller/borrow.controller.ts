import { NextFunction, Request, Response } from "express"
import { successResponse } from "./response.controller"
import Borrow from "../models/borrow.model";
import { throwGenericError } from "../helper/throwGenericError";
import Book from "../models/book.model";
import { IBook, IBorrow } from "../types";

export const getBorrowedBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await Borrow.aggregate(
      [
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
      ]
    )
    successResponse(res, { message: "Borrowed books summary retrieved successfully.", success: true, payload: books })
  } catch (error) {
    next(error)
  }
};

export const borrowBook = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const mongooseIdRegx = /^[0-9a-fA-F]{24}$/;
    if (!mongooseIdRegx.test(req.body.book)) {
      // throw generic error as assignment requirement
      throw throwGenericError("InvalidMongooseID", "Invalid book id. Please provide a valid book id.", "book", req.body.book, 400, "ObjectID");
    }

    const isBookExists = await Book.exists({ _id: req.body.book });
    if (!isBookExists) {
      throw {
        statusCode: 404,
        message: "Book is not found.",
      }
    };

    // check if book is available
    const isAvailable = await Book.isBookAvailable(req.body.book, req.body.quantity);
    if (!isAvailable) {
      throw {
        statusCode: 400,
        message: "Book is not available.",
      }
    }
    const borrow = await Borrow.create(req.body);

    if (!borrow) {
      throw {
        statusCode: 400,
        message: "Failed to borrow this book.",
      }
    };

    // updating book copies after borrow
    await Book.updateCopies(borrow.book, borrow.quantity);

    successResponse(res, { message: "Book borrowed successfully.", success: true, statusCode: 201, payload: borrow })
  } catch (error) {
    next(error)
  }
};

interface IDetailsBorrow extends IBorrow<IBook> {
  book: IBook
}
export const getSingleBorrowBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const borrowId = req.params.borrowId;
    const mongooseIdRegx = /^[0-9a-fA-F]{24}$/;
    if (!mongooseIdRegx.test(borrowId)) {
      // throw generic error as assignment requirement
      throw throwGenericError("InvalidMongooseID", "Invalid book id. Please provide a valid book id.", "borrowId", borrowId, 400, "ObjectID");
    };

    const borrow = await Borrow.findById(borrowId).populate("book").lean<IDetailsBorrow>();

    if (!borrow) {
      throw {
        statusCode: 404,
        message: "Borrow is not found.",
      }
    };

    successResponse(res, { message: "Borrowed book is found successfully.", success: true, payload: borrow })
  } catch (error) {
    next(error)
  }
};

export const updateBorrowBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const borrowId = req.params.borrowId;
    const mongooseIdRegx = /^[0-9a-fA-F]{24}$/;
    if (!mongooseIdRegx.test(borrowId)) {
      // throw generic error as assignment requirement
      throw throwGenericError("InvalidMongooseID", "Invalid book id. Please provide a valid book id.", "borrowId", borrowId, 400, "ObjectID");
    };

    const borrow = await Borrow.findById(borrowId);

    if (!borrow) {
      throw {
        statusCode: 404,
        message: "Borrow is not found.",
      }
    };

    const checkQuantity = await Book.isBookAvailable(borrow.book, (Number(req.body.quantity) - borrow.quantity));
    if (!checkQuantity) {
      throw {
        statusCode: 400,
        message: "Book quantity is not enough.",
      }
    };

    const updatedBorrow = await Borrow.findByIdAndUpdate(borrowId, { quantity: req.body.quantity }, { new: true });

    if (!updatedBorrow) {
      throw {
        statusCode: 400,
        message: "Failed to update this book.",
      }
    };

    await Book.updateCopies(updatedBorrow.book, updatedBorrow.quantity - borrow.quantity);

    successResponse(res, { message: "Borrowed book is updated successfully.", success: true, payload: updatedBorrow })
  } catch (error) {
    next(error)
  }
};

export const deleteBorrowBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const borrowId = req.params.borrowId;
    const mongooseIdRegx = /^[0-9a-fA-F]{24}$/;
    if (!mongooseIdRegx.test(borrowId)) {
      // throw generic error as assignment requirement
      throw throwGenericError("InvalidMongooseID", "Invalid book id. Please provide a valid book id.", "borrowId", borrowId, 400, "ObjectID");
    };

    const borrow = await Borrow.findByIdAndDelete(borrowId);

    if (!borrow) {
      throw {
        statusCode: 404,
        message: "Borrow is not found.",
      }
    };

    await Book.updateCopies(borrow.book, -borrow.quantity);
    successResponse(res, { message: "Borrowed book is deleted successfully.", success: true })
  } catch (error) {
    next(error)
  }
};