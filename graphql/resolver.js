import {
  addBook,
  deleteBook,
  getBooks,
  updateBook,
} from "./services/books_service.js";
import {
  bookHistory,
  bookSummary,
  borrowBook,
  mostActiveUser,
  mostBorrowedBooks,
  returnBook,
} from "./services/borrow_service.js";

export const graphqlResolver = {
  Query: {
    // Books
    getBooks,
    // Borrows
    mostBorrowedBooks,
    mostActiveUser,
    bookHistory,
    bookSummary,
  },
  Mutation: {
    //Books
    addBook,
    updateBook,
    deleteBook,
    // Borrow
    borrowBook,
    returnBook,
  },
};
