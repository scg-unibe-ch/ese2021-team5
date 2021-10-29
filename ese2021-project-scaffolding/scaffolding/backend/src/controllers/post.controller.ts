import express, { Router, Request, Response } from 'express';
import { verifyToken } from '../middlewares/checkAuth';

const postController: Router = express.Router();
const postService = new PostService();

export const PostController: Router = postController;
