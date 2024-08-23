import { GraphqlAuth } from "../../config/graphql_auth.js";
import { Book } from "../../models/books.js";

export const getBooks = async (parent, args, context) => {
  try {
    // Middleware for access prohibition
    if (!GraphqlAuth(["admin", "member"], context.role)) {
      return {
        statusCode: 501,
        success: false,
        message: "Unauthorised access!",
      };
    }
    const allBooks = await Book.find();
    return {
      statusCode: 200,
      success: true,
      data: allBooks,
    };
  } catch (error) {
    return {
      statusCode: 501,
      success: false,
      message: error.message,
    };
  }
};

export const addBook = async (parent, args, context) => {
  try {
    // Middleware for access prohibition
    if (!GraphqlAuth(["admin"], context.role)) {
      return {
        statusCode: 501,
        success: false,
        message: "Unauthorised access!",
      };
    }
    const newBook = await new Book({
      ...args,
    }).save();

    if (newBook) {
      return {
        statusCode: 201,
        success: true,
        message: "Successfully added the new book!",
      };
    } else {
      return {
        statusCode: 501,
        success: false,
        message: "Book was not added!",
      };
    }
  } catch (error) {
    return { statusCode: 501, success: false, message: error.message };
  }
};
export const updateBook = async (parent, args, context) => {
  try {
    // Middleware for access prohibition
    if (!GraphqlAuth(["admin"], context.role)) {
      return {
        statusCode: 501,
        success: false,
        message: "Unauthorised access!",
      };
    }
    const { id } = args;
    const updateBook = await Book.findByIdAndUpdate(id, args, {
      new: true,
    });
    if (!updateBook) {
      return { statusCode: 201, success: false, message: "Book not found!" };
    }
    return {
      statusCode: 201,
      success: true,
      message: "Successfully updated book",
    };
  } catch (error) {
    return { statusCode: 501, success: false, message: error.message };
  }
};
export const deleteBook = async (parent, args, context) => {
  try {
    // Middleware for access prohibition
    if (!GraphqlAuth(["admin"], context.role)) {
      return {
        statusCode: 501,
        success: false,
        message: "Unauthorised access!",
      };
    }
    const book = await Book.findByIdAndDelete(args?.id);
    return {
      statusCode: 201,
      success: true,
      message: "Successfully deleted book",
    };
  } catch (error) {
    return { statusCode: 501, success: false, message: error.message };
  }
};
