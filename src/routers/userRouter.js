import express from 'express';

import UserController from '../controllers/user';

const userRouter = express.Router();

userRouter.post('/register', UserController.registerUser);
userRouter.post('/authenticate', UserController.authenticateUser);

export default userRouter;
