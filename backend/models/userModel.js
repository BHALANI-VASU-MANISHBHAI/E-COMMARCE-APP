import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name :{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    cartData:{
        type: Object,
        default: {}
    },
    profilePhoto:{
        type: String,
        default: "https://res.cloudinary.com/drezv2fgf/image/upload/v1748439973/Profile_avatar_placeholder_large_px5gio.png"
    },
},{minimize:false, timestamps: true})
//minimize:false is used to store empty objects in the database. By default, mongoose removes empty objects from the database.

const UserModel =  mongoose.models.user ||  mongoose.model("User", userSchema);
export default UserModel;