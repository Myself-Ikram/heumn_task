import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books",
      required: true,
    },
    borrow_date: {
      type: Date,
      required: true,
    },
    return_date: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Borrow = mongoose.model("borrow", borrowSchema);
