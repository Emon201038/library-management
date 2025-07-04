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
const mongoose_1 = require("mongoose");
const borrow_model_1 = __importDefault(require("./borrow.model"));
const BookSchema = new mongoose_1.Schema({
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
        enum: {
            values: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
            message: "{VALUE} is not supported."
        }
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
    }
}, {
    timestamps: true,
    versionKey: false
});
// pre save hook: update available field based on copies
BookSchema.pre("save", function (next) {
    if (this.copies === 0) {
        this.available = false;
    }
    else {
        this.available = true;
    }
    next();
});
// post save hook: update available field based on copies
BookSchema.post("findOneAndUpdate", function (doc, next) {
    if (!doc)
        next();
    if (doc.copies === 0) {
        doc.available = false;
    }
    else {
        if (doc.available)
            doc.available = true;
        else
            doc.available = false;
    }
    ;
    doc.save();
    next();
});
// post detele hook: delete books borrowed
BookSchema.post("findOneAndDelete", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!doc)
            next();
        yield borrow_model_1.default.deleteMany({ book: doc._id });
        next();
    });
});
// methods: static
BookSchema.static("updateCopies", function (bookId, copies) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield this.findOneAndUpdate({ _id: bookId }, { $inc: { copies: -copies } }, { new: true });
        return book;
    });
});
BookSchema.static("isBookAvailable", function (bookId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield this.findOne({ _id: bookId });
        if (book && book.copies - quantity >= 0 && book.available) {
            return true;
        }
        return false;
    });
});
const Book = (0, mongoose_1.model)("Book", BookSchema);
exports.default = Book;
