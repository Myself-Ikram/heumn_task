import { Book } from "../../models/books.js";
import { Borrow } from "../../models/borrow.js";

export const borrowBook = async (parent, args, context) => {
  try {
    // Middleware for access prohibition
    if (!GraphqlAuth(["admin", "member"], context.role)) {
      return {
        statusCode: 501,
        success: false,
        message: "Unauthorised access!",
      };
    }
    const { bookId, borrow_date } = args;
    const book = await Book.findById(bookId);
    const borrowCount = await Borrow.countDocuments({
      bookId,
      return_date: undefined,
    });

    if (borrowCount === book?.copies) {
      return { statusCode: 201, success: false, message: "No books left!" };
    }
    const newBorrow = await new Borrow({
      userId: context.userId,
      bookId,
      borrow_date,
    }).save();
    if (!newBorrow) {
      return { statusCode: 201, success: false, message: "Borrow declined!" };
    }
    return {
      statusCode: 201,
      success: true,
      message: "Successfully borrowed book",
    };
  } catch (error) {
    return { statusCode: 201, success: false, message: error.message };
  }
};

export const returnBook = async (parent, args, context) => {
  try {
    // Middleware for access prohibition
    if (!GraphqlAuth(["admin", "member"], context.role)) {
      return {
        statusCode: 501,
        success: false,
        message: "Unauthorised access!",
      };
    }
    const { id } = args;
    const returnStatus = await Borrow.findById(id);
    if (returnStatus?.return_date) {
      return { statusCode: 501, success: false, message: "Already returned!" };
    }
    const updateBorrow = await Borrow.findByIdAndUpdate(
      id,
      { return_date: new Date() },
      {
        new: true,
      }
    );
    if (!updateBorrow) {
      return {
        statusCode: 201,
        success: false,
        message: "Borrow data not found!",
      };
    }
    return {
      statusCode: 201,
      success: true,
      message: "Successfully returned book",
    };
  } catch (error) {
    return { statusCode: 501, success: false, message: error.message };
  }
};

export const bookHistory = async (parent, args, context) => {
  try {
    // Middleware for access prohibition
    if (!GraphqlAuth(["admin", "member"], context.role)) {
      return {
        statusCode: 501,
        success: false,
        message: "Unauthorised access!",
      };
    }
    const myBorrows = await Borrow.find({ userId: context.userId });
    return {
      statusCode: 201,
      success: true,
      message: "Successfully added book",
      data: myBorrows,
    };
  } catch (error) {
    return { statusCode: 501, success: false, message: error.message };
  }
};

export const mostBorrowedBooks = async (parent, args, context) => {
  try {
    // Middleware for access prohibition
    if (!GraphqlAuth(["admin", "member"], context.role)) {
      return {
        statusCode: 501,
        success: false,
        message: "Unauthorised access!",
      };
    }
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
          bookId: "$bookDetails._id",
          bookTitle: "$bookDetails.title",
          count: 1,
        },
      },
    ]);
    console.log(data);

    return { statusCode: 200, success: true, data };
  } catch (error) {
    return { statusCode: 501, success: true, message: error.message };
  }
};

export const mostActiveUser = async (parent, args, context) => {
  try {
    // Middleware for access prohibition
    if (!GraphqlAuth(["admin", "member"], context.role)) {
      return {
        statusCode: 501,
        success: false,
        message: "Unauthorised access!",
      };
    }
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
    return { statusCode: 20, success: true, data };
  } catch (error) {
    return { statusCode: 201, success: false, message: error.message };
  }
};

export const bookSummary = async (req, res) => {
  try {
    // Middleware for access prohibition
    if (!GraphqlAuth(["admin", "member"], context.role)) {
      return {
        statusCode: 501,
        success: false,
        message: "Unauthorised access!",
      };
    }
    const books = await Book.find();
    const borrowedBooks = await Borrow.find({ return_date: undefined });
    let result = [];
    for (let i = 0; i < books?.length; i++) {
      const borrowed = 5;
      result.push({
        ...books[i]?._doc,
        borrowed,
        available: books[i]?.copies - borrowed,
      });
    }
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};
