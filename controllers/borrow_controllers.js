import { borrowBookValidation } from "../config/joi_validation/borrow_validation.js";
import { Book } from "../models/books.js";
import { Borrow } from "../models/borrow.js";

export const borrowBook = async (req, res) => {
  try {
    const { error } = borrowBookValidation(req.body);
    if (error) {
      return res.status(501).json({
        message: "Missing values",
      });
    }
    const { bookId, borrow_date } = req.body;
    const book = await Book.findById(bookId);
    const borrowCount = await Borrow.countDocuments({
      bookId,
      return_date: undefined,
    });

    if (borrowCount === book?.copies) {
      return res.status(200).json({ msg: "No books left to borrow!" });
    }
    const newBorrow = await new Borrow({
      userId: req.userId,
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
};

export const returnBook = async (req, res) => {
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
};

export const bookHistory = async (req, res) => {
  try {
    const myBorrows = await Borrow.find({ userId: req.userId });
    res.status(200).json(myBorrows);
  } catch (error) {
    res.status(501).json({ msg: error.message });
  }
};

export const mostBorrowedBooks = async (req, res) => {
  try {
    const data = await Borrow.aggregate([
      { $group: { _id: "$bookId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          bookId: 1,
          bookTitle: "$bookDetails.title",
          count: 1,
        },
      },
    ]);
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};

export const mostActiveUser = async (req, res) => {
  try {
    const data = await Borrow.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          userId: 1,
          userName: "$userDetails.name",
          count: 1,
        },
      },
    ]);
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};

export const bookSummary = async (req, res) => {
  try {
    const data = await Book.aggregate([
      {
        $lookup: {
          from: "borrows",
          localField: "_id",
          foreignField: "bookId",
          as: "borrowedCopies",
        },
      },
      {
        $project: {
          title: 1,
          author: 1,
          copies: 1,
          BorrowedBooks: {
            $size: {
              $filter: {
                input: "$borrowedCopies",
                as: "borrow",
                cond: { $eq: ["$$borrow.return_date", false] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          AvailableBooks: { $subtract: ["$copies", "$BorrowedBooks"] },
        },
      },
    ]);
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};
