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

// Verify Token for each route
export async function VerifyJWT(req, res, next) {
  const token = req.cookies.token;
  if (!token)
    return res
      .clearCookie("token")
      .status(403)
      .send({ success: false, error: "No token provided." });
  jwt.verify(token, process.env.JWT, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        success: false,
        error: "Failed to authenticate token.",
        msg: err,
      });
    }
    next();
  });
}
