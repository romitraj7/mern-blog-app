import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createPost } from '../controllers/createPost.contoller.js';

const postRouter = express.Router();
postRouter.post('/create',verifyToken,createPost);

export default postRouter;