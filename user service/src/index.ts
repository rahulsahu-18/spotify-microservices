import express, { type Request, type Response } from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { connectDB } from "./connectDB.js";
import userRoute from "./userRouter.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use('/user',userRoute);
app.get('/',(req:Request,res:Response) => {
    res.send("it's working properly");
})

app.listen(PORT,()=>{
    connectDB();
    console.log(`app listen in port no ${PORT}`);
})