import { NextFunction, Request, Response } from "express";
import { successResponse } from "./response.controller";
import Book from "../models/book.model";
import { FilterQuery } from "mongoose";
import { IBook } from "../types";
import { throwGenericError } from "../helper/throwGenericError";

export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    interface IQuery {
      sortBy?: string,
      sort?: "desc" | "asc" | "descending" | "ascending",
      limit?: number,
      filter?: string,
      search?: string,
      page?: number
    }
    const {
      sortBy = "createdAt",
      sort = "desc",
      limit = 10,
      filter,
      search,
      page = 1
    }: IQuery = req.query;

    const filterKeyword: FilterQuery<IBook> = {};


    if (filter && (filter !== "all")) {
      filterKeyword.genre = { $in: filter?.replace("-", " ")?.toUpperCase()?.split(",")?.map((genre) => genre.toUpperCase()) } //multiple genre filtering support
    };

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
      ]
    };


    let resMessage = "Books retrieved  successfully."

    const books = await Book
      .find(filterKeyword)
      .sort({ [sortBy]: (sort === "desc" || sort === "descending") ? -1 : 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    if (books.length === 0) {
      resMessage = "No Books are found."
    };

    const totalBooks = await Book.countDocuments(filterKeyword);

    const pagination = {
      page: Number(page),
      nextPage: Math.ceil(totalBooks / Number(limit)) > Number(page) ? Number(page) + 1 : null,
      prevPage: Number(page) - 1 >= 1 ? Number(page) - 1 : null,
      limit: limit,
      totalItems: totalBooks,
      totalPages: Math.ceil(totalBooks / limit)
    }

    successResponse(res, { message: resMessage, success: true, payload: { books, pagination } })
  } catch (error) {
    next(error)
  }
};

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;

    const book = new Book(body);
    await book.save();

    successResponse(res, { message: "Book created successfully.", success: true, statusCode: 201, payload: book })
  } catch (error) {
    next(error)
  }
};

export const getSingleBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;
    const mongooseIdRegx = /^[0-9a-fA-F]{24}$/;
    if (!mongooseIdRegx.test(bookId)) {
      // throw generic error as assignment requirement
      throw throwGenericError("InvalidMongooseID", "Invalid book id. Please provide a valid book id.", "bookId", bookId);
    }

    const book = await Book.findById(bookId);

    if (!book) {
      throw {
        statusCode: 404,
        message: "Book is not found.",
      }
    }
    successResponse(res, {
      success: true,
      message: "Book retrieved successfully.",
      payload: book
    })
  } catch (error) {
    next(error)
  }
};

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;
    const mongooseIdRegx = /^[0-9a-fA-F]{24}$/;
    if (!mongooseIdRegx.test(bookId)) {
      // throw generic error as assignment requirement
      throw throwGenericError("InvalidMongooseID", "Invalid book id. Please provide a valid book id.", "bookId", bookId);
    };

    const allowedFields: Record<string, string> = {
      title: "string",
      author: "string",
      genre: "string",
      description: "string",
      copies: "number",
      isbn: "number",
      available: "boolean",
      publishedYear: "number",
      publisher: "string",
      pages: "number",
      language: "string",
      price: "string",
      image: "string"
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
        throw throwGenericError("InvalidType", message, key, value as string, 400, "number");
      }
    };

    const book = await Book.findByIdAndUpdate(bookId, {
      $set: req.body
    }, {
      new: true, runValidators: true
    });

    // Check if book is not found
    if (!book) {
      throw {
        statusCode: 404,
        message: "Book is not found.",
      }
    }

    successResponse(res, { message: "Book updated successfully.", success: true, payload: book })
  } catch (error) {
    next(error)
  }
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;
    const mongooseIdRegx = /^[0-9a-fA-F]{24}$/;
    if (!mongooseIdRegx.test(bookId)) {
      // throw generic error as assignment requirement
      throw throwGenericError("InvalidMongooseID", "Invalid book id. Please provide a valid book id.", "bookId", bookId);
    };

    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
      throw {
        statusCode: 404,
        message: "Book is not found.",
      }
    }
    successResponse(res, { message: "Book deleted successfully.", success: true })
  } catch (error) {
    next(error)
  }
}