import express from 'express';
import { createComment, deleteComment, editComment, getComments, getPostComments, likeComment } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const commentRouter = express.Router();
commentRouter.post('/create',verifyToken,createComment);
commentRouter.get(`/getPostComments/:postId`,getPostComments);
commentRouter.put(`/likecomment/:commentId`,verifyToken,likeComment);
commentRouter.put(`/editcomment/:commentId`,verifyToken,editComment);
commentRouter.delete(`/deleteComment/:commentId`,verifyToken,deleteComment);
commentRouter.get(`/getcomments`,verifyToken,getComments);
export default commentRouter;