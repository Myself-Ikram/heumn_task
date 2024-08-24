import jwt from "jsonwebtoken";

export async function Authentication(req, res, next) {
  const token = req.cookies.token;
  if (!token)
    return res
      .clearCookie("token")
      .status(403)
      .json({ success: false, message: "No token provided." });
  jwt.verify(token, process.env.JWT, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: "Failed to authenticate token.",
        message: err,
      });
    }
    next();
  });
}
