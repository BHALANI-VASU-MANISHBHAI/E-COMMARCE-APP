import mongoose from "mongoose";
import OTP from "../models/otpModel.js";
import { sendOtpEmail } from "../services/emailService.js";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import axios from "axios";
const TWOFACTOR_API_KEY = process.env.TWOFACTOR_API_KEY;
async function storeOTP(req, res) {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
    // Save OTP in DB (remove old OTPs for this email first)
    await OTP.deleteMany({ email });
    const otpDoc = new OTP({ email, otp });
    await otpDoc.save();

    // Send OTP email
    await sendOtpEmail(email, otp);

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Failed to send OTP" });
  }
}

async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;
    console.log("Verifying OTP for email:", email);
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP required" });

    // Find OTP in DB
    const otpDoc = await OTP.findOne({ email, otp });
    if (!otpDoc) return res.status(400).json({ message: "Invalid OTP" });

    const isExpired = Date.now() - otpDoc.createdAt.getTime() > 10 * 60 * 1000;
    if (isExpired) {
      await OTP.deleteOne({ _id: otpDoc._id }); // Remove expired OTP
      return res.status(400).json({ message: "OTP expired" });
    }

    // OTP is valid
    return res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Failed to verify OTP" });
  }
}
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.json({
        success: false,
        message: "Email and new password are required",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update only password and updatedAt without fetching the user document
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { password: hashedPassword, updatedAt: new Date() },
      { new: true } 
    );

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Failed to reset password" });
  }
};

const PhoneSentOTP = async (req, res) => {
const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: "Phone number required" });

  try {
    const response = await axios.get(
      `https://2factor.in/API/V1/${TWOFACTOR_API_KEY}/SMS/${phone}/AUTOGEN`
    );
    if (response.data.Status === "Success") {
      return res.json({ success: true, sessionId: response.data.Details });
    } else {
      return res.json({ success: false, message: "Failed to send OTP" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

const verifyPhoneOTP = async (req, res) => {
  const { sessionId, otp } = req.body;
  if (!sessionId || !otp) return res.status(400).json({ success: false, message: "Invalid data" });

  try {
    const response = await axios.get(
      `https://2factor.in/API/V1/${TWOFACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
    );
    if (response.data.Status === "Success") {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, message: "OTP verification failed" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
}


export { storeOTP, verifyOTP, resetPassword , PhoneSentOTP, verifyPhoneOTP };
