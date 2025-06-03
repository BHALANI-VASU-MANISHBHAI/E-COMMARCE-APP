import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from 'cloudinary';

const createdToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}


// route for user login
const loginUser = async (req, res) => {
    try{
           const {email,password} = req.body;

           const user = await userModel.findOne({email});

           if(!user){
               return res.json({message:"User not found"});
           }

           const isMatch = await bcrypt.compare(password, user.password);

              if(isMatch){
                const token = createdToken(user._id);
                return res.status(200).json({success:true,token});
              }else{
                return res.json({ success:false,message:"Invalid credentials"});
              }

    }catch(err){
        console.log(err);
        return res.json({success:false,message:err.message});
    }

};

// route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({success:false, message: "User already exists" });
    }

    //validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token  = createdToken(user._id);

    res.json({success:true,token});

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// route for admin login
const adminLogin = async (req, res) => {

    const {email,password} = req.body;

    if(email ==process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD){
        const token = createdToken(email +password , process.env.JWT_SECRET);
        return res.status(200).json({success:true,token});
    }else{
        return res.status(400).json({success:false,message:"Invalid credentials"});
    }

};


//Get user data by Id

const getUserById = async (req, res) => {

try{

    const userId= req.userId;


   const user = await userModel.findById(userId);

    if(!user){
        return res.json({success:false,message:"User not found"});
    }
    return res.json({success:true,user});
   
}catch(err){
    console.log(err);
    return res.json({success:false,message:err.message});
  }
}

const UpdateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const profileImage = req.file; // optional
    const { firstName, lastName, email, phone, gender } = req.body;

    if (!firstName || !lastName || !email || !phone || !gender) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    let updateData = {
      firstName,
      lastName,
      email,
      phone,
      gender,
    };

    // Only upload if user sent a new image
    if (profileImage) {
      const result = await cloudinary.uploader.upload(profileImage.path, { resource_type: 'image' });
      updateData.profilePhoto = result.secure_url;
      console.log("Image uploaded to Cloudinary:", result.secure_url);
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });
    res.json({ success: true, user: updatedUser });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};




export { loginUser, registerUser, adminLogin,getUserById,UpdateProfile };
