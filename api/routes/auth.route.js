import express from 'express';
import {signup} from '../controllers/auth.controller.js';
import { signin } from '../controllers/auth.controller.js';
const authRouter = express.Router();
authRouter.post('/signup',signup);
authRouter.post('/signin',signin);
export default authRouter