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
import borrowRouter from "./routers/borrower_router.js";
import jwt from "jsonwebtoken";
import { createContext } from "./config/graphql_auth.js";

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

// Test
app.use("/test", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: "Hello", users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.use(
  "/graphql_test",
  expressMiddleware(apollo_server, {
    context: async ({ req }) => createContext({ req }),
  })
);

// ROUTES

//RestAPI
app.use("/login", loginRouter);

//Authorisation of all routes
app.use(VerifyJWT);

app.use("/books", bookRouter);
app.use("/borrow", borrowRouter);
//GraphQL
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
