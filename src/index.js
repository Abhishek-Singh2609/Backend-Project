// require('dotenv').config({path: "./env"}) 
import dotenv from "dotenv";

import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";
import connectDB from "./db/index.js";
const app = express();
dotenv.config({path :"./env"})






connectDB() 
.then(()=>{
app.listen(process.env.PORT || 8000,()=>{
    })
    console.log(`MongoDB is Connected at port ${process.env.PORT}`);
})
.catch((error)=>{
    console.log("MONGOdb connection failed !!! error" ,error);
})















/*
( async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}`/`${DB_NAME}`)
       app.on("error",(error)=>{
        console.log("Error :" ,error);
        throw error;
       })

app.listen(process.env.PORT,()=>{
    console.log(`App is listening on Port ${process.env.PORT} `);
})

    } catch (error) {
        console.error("ERROR :", error);
        throw error
    }
})()      //This is IIFi function og JS ()() OR we can also use normal function */