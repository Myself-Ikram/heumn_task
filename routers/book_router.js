import express from "express";
import { Book } from "../models/books.js";
import Authorization from "../config/auth.js";

const bookRouter = express.Router();

// Get Books
bookRouter.get("/", Authorization(["admin", "member"]), async (req, res) => {
  try {
    const allBooks = await Book.find();
    res.status(200).json(allBooks);
  } catch (error) {
    res.status(501).json({ msg: error.message });
  }
});
// Add Books
bookRouter.post("/add_new", Authorization(["admin"]), async (req, res) => {
  try {
    const newBook = await new Book({
      ...req.body,
    }).save();
    if (newBook) {
      res.status(201).json({ msg: "Successfully added the new book!" });
    } else {
      res.status(501).json({ msg: "Book was not created!" });
    }
  } catch (error) {
    res.status(501).json({ msg: error.message });
  }
});

//Update Book
bookRouter.put("/update/:id", Authorization(["admin"]), async (req, res) => {
  try {
    const updateBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updateBook) {
      return res.status(404).json({ msg: "Book not found" });
    }
    res.status(201).json({ msg: "Successfully updated the book" });
  } catch (error) {
    res.status(501).json({ msg: error.message });
  }
});

//Delete Book
bookRouter.delete("/delete/:id", Authorization(["admin"]), async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Successfully Deleted" });
  } catch (error) {
    res.status(501).json({ msg: error.message });
  }
});

export default bookRouter;
