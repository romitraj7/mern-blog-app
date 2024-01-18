import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.route.js';
dotenv.config();
mongoose.connect(process.env.MONGO)
.then(()=>{console.log("database connected")})
.catch((error)=>{console.log(error)})
const app = express()
app.use(express.json())
const port = 3000;

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
// middleware for errors
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})
app.listen(port,(req,res)=>{
    console.log(`Server is running on http://localhost:${port}`)
});
