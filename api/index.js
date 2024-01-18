import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
mongoose.connect(process.env.MONGO)
.then(()=>{console.log("database connected")})
.catch((error)=>{console.log(error)})
const app = express()
const port = 3000;

app.get('/',(req,res)=>{
    res.send("hello")
})

app.listen(port,(req,res)=>{
    console.log(`Server is running on http://localhost:${port}`)
});
