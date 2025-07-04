"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BorrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Book",
        required: [true, "Book is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be greater than 0"],
    },
    dueDate: {
        type: Date,
        required: [true, "Due date is required"],
    }
}, { timestamps: true, versionKey: false });
const Borrow = (0, mongoose_1.model)("Borrow", BorrowSchema);
exports.default = Borrow;
