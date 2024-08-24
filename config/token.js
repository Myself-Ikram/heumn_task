import jwt from "jsonwebtoken";

// Generate Token
export const generateToken = (user) => {
  const payload = {
    id: user?._id,
    email: user?.email,
    role: user?.role,
  };
  return jwt.sign(payload, process.env.JWT, { expiresIn: "1h" });
};
