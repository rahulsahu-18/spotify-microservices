import express from "express";
import { loginUser, logout, registerUser, user } from "./userController.js";
import isAuth from "./middleware.js";

const userRoute = express.Router();

userRoute.post('/v1/register',registerUser);
userRoute.post('/v1/login',loginUser);
userRoute.get('/v1/me',isAuth,user);
userRoute.get('/v1/logout',logout);

export default userRoute;