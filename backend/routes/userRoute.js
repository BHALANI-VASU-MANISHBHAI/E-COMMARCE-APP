import express from 'express';
import { Router } from 'express';
import { loginUser,registerUser,adminLogin,getUserById ,UpdateProfile,googleAuth,getTotalCustomers} from '../controllers/UserController.js';
import authUser from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';



const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/google', googleAuth);
userRouter.post('/getdataofuser', authUser,getUserById);
userRouter.put('/updateprofile', authUser, upload.single("profileImage"),
 UpdateProfile);
userRouter.post('/getuserbyid/:id', authUser, getUserById); 
userRouter.get('/totalusers',adminAuth,getTotalCustomers);

export default userRouter;