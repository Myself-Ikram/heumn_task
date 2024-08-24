import jwt from "jsonwebtoken";

export const createContext = ({ req }) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT);
      return {
        userId: decodedToken.id,
        role: decodedToken.role,
      };
    } catch (error) {
      throw new Error("Invalid token");
    }
  } else {
    throw new Error("No token provided");
  }
};

export const GraphqlAuth = (accessArray, role) => accessArray?.includes(role);
