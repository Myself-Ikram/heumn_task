import express from "express";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { generateToken } from "../config/token.js";
import { loginUser, registerUser } from "../controllers/login_controllers.js";

const loginRouter = express.Router();

// Register user
loginRouter.post("/register", registerUser);

//Login user
loginRouter.post("/", loginUser);

export default loginRouter;
