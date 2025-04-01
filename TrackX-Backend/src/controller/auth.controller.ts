import { Request, Response } from "express";
import registerSchema from "../validations/Register";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import loginSchema from "../validations/Login";
import accessToken from "../utility/jwt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUserModel, IUserSettingSchema } from "../interfaces/Project";
import UserSetting from "../models/userSetting.route";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // const input validations
    const validation = registerSchema.safeParse({ name, email, password });

    if (!validation.success) {
      res.status(400).json({ message: validation.error.errors[0].message });
      return;
    }

    // register user
    const user: IUserModel | null = await User.findOne({ email });

    if (user) {
      res.status(400).json({ message: "user already exists" });
      return;
    }

    // hasing password
    const hashPassword: string = bcrypt.hashSync(password, 10);

    const newUser = await User.create({ name, email, password: hashPassword });

    res.status(200).json({
      message: "user registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error while register" });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // validations of input
    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      res.status(400).json({ message: validation.error.errors[0].message });
      return;
    }

    // check user exists or not
    const user: IUserModel | null = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "user not found" });
      return;
    }

    // check password
    const isPasswordMatch: boolean = bcrypt.compareSync(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      res.status(400).json({ message: "password is incorrect" });
      return;
    }

    const updatedSettings: IUserSettingSchema | null = await UserSetting.create(
      {
        userId: user._id,
        userEmail : user.email
      }
    );

    updatedSettings.save();

    const token = accessToken({
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      id: user._id as string,
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "user logged in successfully",
      data: user,
    });
  } catch (error) {
    console.dir(error);
    res.status(500).json({ message: "server error while login" });
  }
};

export const logOut = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none", 
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error while logout" });
  }
};

export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      res.status(401).json({ authenticated: false });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!decoded) {
      res.status(401).json({ authenticated: false });
      return;
    }

    const user: IUserModel | null = await User.findById(decoded.id).select(
      "-password -updatedAt -__v"
    );

    if (!user) {
      res.status(401).json({ authenticated: false });
      return;
    }

    res.json({ authenticated: true });
  } catch (error) {
    res.status(401).json({ authenticated: false });
  }
};

export const updatePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;

    const token = req.cookies.authToken;
    if (!token) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded) {
      res.status(401).json({ success: false, message: "unauthorized" });
      return;
    }

    const user: IUserModel | null = await User.findById(decoded.id);

    if (!user) {
      res.status(404).json({ success: false, message: "user not found" });
      return;
    }

    const isOldPasswordMatch: boolean = bcrypt.compareSync(
      oldPassword,
      user.password
    );

    if (!isOldPasswordMatch) {
      res
        .status(400)
        .json({ success: false, message: "old password is incorrect" });
      return;
    }

    const hashPassword: string = bcrypt.hashSync(newPassword, 10);

    user.password = hashPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "password updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "server error while update password" });
  }
};

export const eraseAccount = async (
  req: Request,
  res: Response
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

    const user: IUserModel | null = await User.findByIdAndDelete(decoded.id);

    if (!user) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "account deleted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "server error while delete account" });
  }
};

// t