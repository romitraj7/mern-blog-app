import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createPost, getPosts ,deletePost, updatePost } from '../controllers/createPost.contoller.js';

const postRouter = express.Router();
postRouter.post('/create',verifyToken,createPost);
postRouter.get('/getposts',getPosts);
postRouter.delete('/deletepost/:postId/:userId',verifyToken,deletePost);
postRouter.put('/updatepost/:postId/:userId',verifyToken,updatePost);
export default postRouter;