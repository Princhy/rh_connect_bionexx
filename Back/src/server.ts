import express  from "express";
import { Request, Response } from "express"
import dotenv from "dotenv"
dotenv.config();//initialisation dotenv
import myDataSource  from "./app-data-source"
import { app } from "./app";

//database connection
myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })


app.get('/',(req:Request,res:Response)=>{
    res.send('hello')
})

// start express server
app.listen(process.env.PORT,()=>{
    console.log("l'application marche sur localhost:" + process.env.PORT)
})


