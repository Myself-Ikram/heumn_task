import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      default: "member",
      enum: ["admin", "member"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;

  // Only hash the password if
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    // Adjust salt rounds as needed
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

export const User = mongoose.model("user", userSchema);
