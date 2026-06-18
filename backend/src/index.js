import dotenv from "dotenv"
import express from "express"
import connectDB from "./db/index.js"
import app from "./app.js";

dotenv.config({path: './env'});


connectDB()
.then(()=>{
    app.listen(process.env.PORT||5000,()=>{
        console.log(`app listening at port: ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log(`DB connection failed: ${err}`);
})
