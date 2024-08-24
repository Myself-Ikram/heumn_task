import express from "express";
import Authorization from "../middlewares/auth.js";
import {
  bookHistory,
  bookSummary,
  borrowBook,
  mostActiveUser,
  mostBorrowedBooks,
  returnBook,
} from "../controllers/borrow_controllers.js";
import { Authentication } from "../middlewares/authenticate.js";

const borrowRouter = express.Router();

// Borrow a book
borrowRouter.post("/", Authorization(["member", "admin"]), borrowBook);
// Return a book
borrowRouter.get("/return/:id", Authorization(["member", "admin"]), returnBook);

//Borrow History
borrowRouter.get("/myborrow", Authorization(["member", "admin"]), bookHistory);

// Aggregations
// Most borrowed books
borrowRouter.get(
  "/most_borrowed_books",
  Authentication,
  Authorization(["admin", "member"]),
  mostBorrowedBooks
);

// Most active users
borrowRouter.get(
  "/most_active_users",
  Authentication,
  Authorization(["admin", "member"]),
  mostActiveUser
);

// Books summary
borrowRouter.get(
  "/books_summary",
  Authentication,
  Authorization(["admin", "member"]),
  bookSummary
);
export default borrowRouter;
