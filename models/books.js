import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    publication_date: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      default: "Others",
      enum: [
        "Horror",
        "Fiction",
        "Science",
        "Stories",
        "Romance",
        "Novels",
        "Others",
      ],
    },
    copies: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("book", bookSchema);
