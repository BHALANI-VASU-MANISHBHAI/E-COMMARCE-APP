import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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

export { loginUser, registerUser, adminLogin };
