import { Request, Response, NextFunction } from "express";
import { AuthRequest, IUserModel } from "../interfaces/Project";
import { User } from "../models";
import jwt, { JwtPayload } from "jsonwebtoken";

const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    const user: IUserModel | null = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    req.id = user.id;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

export default isAuthenticated;