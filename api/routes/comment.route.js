import express from 'express';
import { createComment, getPostComments, likeComment } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const commentRouter = express.Router();
commentRouter.post('/create',verifyToken,createComment);
commentRouter.get(`/getPostComments/:postId`,getPostComments);
commentRouter.put(`/likecomment/:commentId`,verifyToken,likeComment);
export default commentRouter;