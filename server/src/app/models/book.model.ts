import { Schema, model } from "mongoose";
import { IBook, IBookModelType } from "../types";
import Borrow from "./borrow.model";

const BookSchema = new Schema<IBook, IBookModelType>({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    // enum: {
    //   values: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
    //   message: "{VALUE} is not supported."
    // }
  },
  isbn: {
    type: Number,
    required: [true, "ISBN is required"],
    unique: [true, "ISBN must be unique"]
  },
  copies: {
    type: Number,
    required: [true, "Copies is required"],
    min: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  image: String,
  publisher: String,
  publishedYear: {
    type: Number
  },
  pages: {
    type: Number
  },
  language: String,
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  price: String,
}, {
  timestamps: true,
  versionKey: false
});

// pre save hook: update available field based on copies
BookSchema.pre("save", function (next) {
  if (this.copies === 0) {
    this.available = false;
  } else {
    if (this.available)
      this.available = true;
    else
      this.available = false
  }
  next();
});

// post save hook: update available field based on copies
BookSchema.post("findOneAndUpdate", function (doc, next) {

  if (!doc) next()
  if (doc.copies === 0) {
    doc.available = false;
  } else {
    if (doc.available)
      doc.available = true;
    else
      doc.available = false
  };
  doc.save();
  next();
});

// post detele hook: delete books borrowed
BookSchema.post("findOneAndDelete", async function (doc, next) {
  if (!doc) next()
  await Borrow.deleteMany({ book: doc._id });
  next()
})

// methods: static
BookSchema.static("updateCopies", async function (bookId: Schema.Types.ObjectId, copies: number): Promise<IBook | null> {
  const book = await this.findOneAndUpdate({ _id: bookId }, { $inc: { copies: -copies } }, { new: true });
  return book
});

BookSchema.static("isBookAvailable", async function (bookId: Schema.Types.ObjectId, quantity: number): Promise<boolean> {
  const book = await this.findOne({ _id: bookId });
  if (book && book.copies - quantity >= 0 && book.available) {
    return true
  }
  return false
});


const Book = model<IBook, IBookModelType>("Book", BookSchema);
export default Book