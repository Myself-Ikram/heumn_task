import { User } from "../models/user.js";

export const registerUser = async (req, res) => {
  try {
    const { email } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(501).json({
        message: "Already user exist!",
      });
    }

    const newUser = await new User({ ...req.body }).save();
    if (newUser) {
      res.status(201).json({ msg: "Successfully created the new user!" });
    } else {
      res.status(501).json({ msg: "User was not created!" });
    }
  } catch (error) {
    res.status(501).json({ msg: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(501).json({
        message: "No user",
      });
    }
    const passwordValidate = await bcrypt.compare(password, user?.password);
    if (!passwordValidate) {
      return res.status(501).json({
        message: "Entered password is incorrect",
      });
    }
    const token = generateToken(user);
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        expires: new Date(Date.now() + 9000000),
      })
      .status(200)
      .json({
        success: true,
        statusCode: 201,
        message: "Successfully loggedIn",
      });
  } catch (error) {
    res.status(501).json({ msg: error.message });
  }
};
