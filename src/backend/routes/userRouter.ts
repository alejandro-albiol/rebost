import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';

const userRouter = Router();

userRouter.post('/register', UserController.registerUser);

export default userRouter;
