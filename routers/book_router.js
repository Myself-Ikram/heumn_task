import express from "express";
import Authorization from "../config/auth.js";
import {
  addBooks,
  deleteBook,
  getBooks,
  updateBook,
} from "../controllers/book_controllers.js";

const bookRouter = express.Router();

// Get Books
bookRouter.get("/", Authorization(["admin", "member"]), getBooks);
// Add Books
bookRouter.post("/add_new", Authorization(["admin"]), addBooks);

//Update Book
bookRouter.put("/update/:id", Authorization(["admin"]), updateBook);

//Delete Book
bookRouter.delete("/delete/:id", Authorization(["admin"]), deleteBook);

export default bookRouter;
