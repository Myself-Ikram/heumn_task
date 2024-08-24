import jwt from "jsonwebtoken";

function Authorization(AccessUser) {
  return (req, res, next) => {
    const decodedToken = jwt.decode(req.cookies.token);
    req.userId = decodedToken?.id;
    req.role = decodedToken?.role;

    const isAuthorized = AccessUser?.includes(req.role);
    if (isAuthorized) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        code: 403,
        message: "cannot access this route",
      });
    }
  };
}

export default Authorization;
