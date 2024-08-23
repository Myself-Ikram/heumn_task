import express from "express";
import Authorization from "../config/auth.js";
import { Borrow } from "../models/borrow.js";
import { Book } from "../models/books.js";

import jwt from "jsonwebtoken";

const borrowRouter = express.Router();

// Borrow a book
borrowRouter.post("/", Authorization(["member", "admin"]), async (req, res) => {
  try {
    const { bookId, borrow_date } = req.body;
    const decodeToken = jwt.decode(req.cookies.token);
    const book = await Book.findById(bookId);
    const borrowCount = await Borrow.countDocuments({
      bookId,
      return_date: undefined,
    });

    if (borrowCount === book?.copies) {
      return res.status(200).json({ msg: "No books left to borrow!" });
    }
    const newBorrow = await new Borrow({
      userId: decodeToken?.id,
      bookId,
      borrow_date,
    }).save();
    if (!newBorrow) {
      res.status(501).json({ msg: "Borrow declined!" });
    }
    res.status(201).json({ msg: "Successfully borrowed a book!" });
  } catch (error) {
    res.status(501).json({ msg: error.message });
  }
});
// Return a book
borrowRouter.get(
  "/return/:id",
  Authorization(["member", "admin"]),
  async (req, res) => {
    try {
      const returnStatus = await Borrow.findById(req.params.id);
      if (returnStatus?.return_date) {
        return res
          .status(200)
          .json({ msg: "Already the book has been returned" });
      }
      const updateBorrow = await Borrow.findByIdAndUpdate(
        req.params.id,
        { return_date: new Date() },
        {
          new: true,
        }
      );
      if (!updateBorrow) {
        return res.status(404).json({ msg: "Borrow data not found" });
      }
      res.status(201).json({ msg: "Successfully returned the book" });
    } catch (error) {
      res.status(501).json({ msg: error.message });
    }
  }
);

//Borrow History
borrowRouter.get(
  "/myborrow",
  Authorization(["member", "admin"]),
  async (req, res) => {
    try {
      const decodeToken = jwt.decode(req.cookies.token);
      const myBorrows = await Borrow.find({ userId: decodeToken?.id });
      res.status(200).json(myBorrows);
    } catch (error) {
      res.status(501).json({ msg: error.message });
    }
  }
);

export default borrowRouter;
