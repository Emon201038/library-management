import { model, Schema } from "mongoose";
import { IBorrow } from "../types";

const BorrowSchema = new Schema<IBorrow>({
  book: {
    type: Schema.Types.ObjectId,
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


const Borrow = model<IBorrow>("Borrow", BorrowSchema);
export default Borrow