import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import cors from 'cors'
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import postRouter from './routes/post.route.js';
import commentRouter from './routes/comment.route.js';
import path from 'path';
dotenv.config();
mongoose.connect(process.env.MONGO)
.then(()=>{console.log("database connected")})
.catch((error)=>{console.log(error)})
const __dirname = path.resolve();
const app = express();
const port = 3000;
app.use(express.json());
// app.use(cors())
app.use(cookieParser());
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/post' ,postRouter);
app.use('/api/comment',commentRouter);

app.use(express.static(path.join(__dirname,'/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
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
