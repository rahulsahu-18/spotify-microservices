import express from "express";
import dotenv from "dotenv";
import songRouter from "./songRoutes.js";
dotenv.config();


const app = express();
app.use(express.json());

const PORT = process.env.PORT;
app.use('/api/v1',songRouter);
app.listen(PORT,()=>{
        console.log(`server started on ${PORT}`)
})