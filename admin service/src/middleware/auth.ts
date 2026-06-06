import axios from 'axios';
import type{ Response,Request,NextFunction } from 'express';

interface Iuser {
  _id: string;
  name: string;
  email: string;
  role: string;
  playlist: string[];
}

export interface AuthenticatedRequest extends Request{
  user?: Iuser | null;
}
export const isAuth = async (req:AuthenticatedRequest,res:Response,next:NextFunction):Promise<void> => {
   try {
     const {token} = req.cookies;
      if (!token) {
      res.status(403).json({
        message: "Please Login",
      });
      return;
    }
    const { data } = await axios.get(
  `${process.env.User_URL}/user/v1/me`,
  {
    headers: {
      Cookie: `token=${token}`,
    },
  }
);
    req.user = data
    next();
   } catch (error) {
    res.status(401).json({
    message: "Unauthorized",
  });
  return;
   }
}