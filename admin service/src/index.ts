import express from "express";
import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";
import adminRouter from "./adminRoutes.js";
import { sql } from "./config/db.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME as string,
    api_key:process.env.API_KEY as string,
    api_secret:process.env.API_SECRET as string,
})

async function initDB() {
    try {
    await sql`CREATE TABLE IF NOT EXISTS albums(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    thumbnill VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;

    await sql`CREATE TABLE IF NOT EXISTS songs(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    thumbnill VARCHAR(255) NULL,
    audio VARCHAR(255) NOT NULL,
    album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;
     
     console.log("database initialize successfully");
    } catch (error) {
         console.log("database initialize faild");
    }
    
}
const PORT = process.env.PORT

app.use(express.json());
app.use(cookieParser());
app.use('/',adminRouter);

initDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`server started on ${PORT}`)
    })
})
