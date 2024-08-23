import jwt from "jsonwebtoken";

function Authorization(AccessUser) {
  return (req, res, next) => {
    const decodedToken = jwt.decode(req.cookies.token);
    const isAuthorized = AccessUser?.includes(decodedToken?.role);

    if (isAuthorized) {
      next();
    } else {
      res.status(403).json({
        success: false,
        code: 403,
        message: "cannot access this route",
      });
    }
  };
}

export default Authorization;
