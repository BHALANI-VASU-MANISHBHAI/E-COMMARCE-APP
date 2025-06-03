import { storeOTP,
    verifyOTP,resetPassword } from '../controllers/otpController.js';
import express from 'express';
import { Router } from 'express';


const otpRouter = express.Router();



// Route to request OTP
otpRouter.post('/forgot-password',storeOTP);
// Route to verify OTP
otpRouter.post('/verify-otp', verifyOTP);
// Route to reset password
otpRouter.post('/reset-password', resetPassword);

export default otpRouter;