import express from 'express';
import { createComment, getPostComments } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const commentRouter = express.Router();
commentRouter.post('/create',verifyToken,createComment);
commentRouter.get(`/getPostComments/:postId`,getPostComments);
export default commentRouter;