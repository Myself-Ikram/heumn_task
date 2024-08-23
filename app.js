import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose, { Query } from "mongoose";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { graphqlResolver } from "./graphql/resolver.js";
import { graphqlDefs } from "./graphql/type_defs.js";
import bookRouter from "./routers/book_router.js";
import loginRouter from "./routers/login_router.js";
import { User } from "./models/user.js";
import { VerifyJWT } from "./config/token.js";

// Test
export let sample_users = [
  { _id: 1, name: "A", password: "A", email: "a@gmail.com", role: "admin" },
  { _id: 2, name: "B", password: "B", email: "b@gmail.com", role: "member" },
  { _id: 3, name: "C", password: "C", email: "c@gmail.com", role: "member" },
  { _id: 4, name: "D", password: "D", email: "d@gmail.com", role: "member" },
];
export let sample_books = [
  {
    _id: 1,
    title: "Title1",
    author: "Auth1",
    isbn: "l",
    copies: 1,
    genre: "G1",
    publication_date: "P1",
  },
  {
    _id: 2,
    title: "Title2",
    author: "Auth2",
    isbn: "l",
    copies: 5,
    genre: "G2",
    publication_date: "P2",
  },
  {
    _id: 3,
    title: "Title3",
    author: "Auth3",
    isbn: "l",
    copies: 4,
    genre: "G3",
    publication_date: "P3",
  },
];

export let sample_borrow = [
  {
    user: 1,
    book: 1,
    return_status: true,
    return_date: "12",
    borrow_date: "10",
  },
  {
    user: 1,
    book: 2,
    return_status: true,
    return_date: "15",
    borrow_date: "8",
  },
  { user: 2, book: 1, return_status: false, borrow_date: "10" },
  { user: 3, book: 2, return_status: false, borrow_date: "10" },
];

//Express
const app = express();
app.use(express.json());

//Apollo Server
const apollo_server = new ApolloServer({
  typeDefs: graphqlDefs,
  resolvers: graphqlResolver,
});
await apollo_server.start();

//Dotenv
dotenv.config();

//CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//COOKIE
app.use(cookieParser());

// ROUTES
app.use("/test", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: "Hello", users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//RestAPI
app.use("/login", loginRouter);

//Authorisation of all routes
app.use(VerifyJWT);
app.use("/books", bookRouter);

//GraphQL Route
app.use("/graphql", expressMiddleware(apollo_server));

// INVALID ROUTE
app.use("*", (req, res) => {
  res.status(500).json({
    success: false,
    statusCode: 500,
    url: req.baseUrl,
    type: req.method,
    message: "Route not found",
  });
});

// Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("-------------------------");
      console.log(`=>Connected to Database`);
      console.log(`=>Server listening on port ${process.env.PORT}`);
      console.log("-------------------------");
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
