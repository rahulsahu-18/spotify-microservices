import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import TryCatch from "./Trycatch.js";
import { User } from "./model.js";
import type { AuthRequest } from "./middleware.js";

export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ message: "user alredy exist" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ _id: user._id }, process.env.JWTSEC as string, {
    expiresIn: "7d",
  });

  res.cookie("token",token,{
    httpOnly:true,
    secure:false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }).status(201).json({
    message: "user registered successfully",
    user,
    token,
  });
});
export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  const isMatch = await bcrypt.compare(password,user.password);
  if(!isMatch)
  {
    return res.status(400).json({ message: "password incorrect" });
  }

  const token = jwt.sign({_id:user._id},process.env.JWTSEC as string,{expiresIn:"7d"});

  res.cookie("token",token,{
    httpOnly:true,
    secure:false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }).status(201).json({
    message:"login successfully",
    user
  })
});
export const logout = async (req: Request, res: Response) => {};
export const user = TryCatch(async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  const user = await User.findById(userId).select("-password");
  
  res.status(200).json({user});
});
