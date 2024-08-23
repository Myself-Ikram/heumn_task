import { Book } from "../models/books.js";

export const getBooks = async (req, res) => {
  try {
    const allBooks = await Book.find();
    res.status(200).json(allBooks);
  } catch (error) {
    res.status(501).json({ msg: error.message });
  }
};

export const addBooks = async (req, res) => {
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
};

export const updateBook = async (req, res) => {
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
};
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Successfully Deleted" });
  } catch (error) {
    res.status(501).json({ msg: error.message });
  }
};
