import express from 'express';
import { Router } from 'express';
import { loginUser,registerUser,adminLogin,getUserDataById } from '../controllers/UserController.js';
import authUser from '../middleware/auth.js';


const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/getdata', authUser,getUserDataById);


export default userRouter;