import express from 'express';
import { Router } from 'express';
import { loginUser,registerUser,adminLogin,getUserById ,UpdateProfile} from '../controllers/UserController.js';
import authUser from '../middleware/auth.js';
import upload from '../middleware/multer.js';



const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/getdataofuser', authUser,getUserById);
userRouter.put('/updateprofile', authUser, upload.single("profileImage"),
 UpdateProfile);


export default userRouter;