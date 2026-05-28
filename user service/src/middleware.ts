import type { NextFunction, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request } from "express";

export interface AuthRequest extends Request {
  userId?: string;
}

const isAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWTSEC as string
    ) as JwtPayload;

    req.userId = decoded._id;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default isAuth;