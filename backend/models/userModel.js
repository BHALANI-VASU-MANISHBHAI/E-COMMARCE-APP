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
    }
},{minimize:false, timestamps: true})
//minimize:false is used to store empty objects in the database. By default, mongoose removes empty objects from the database.

const UserModel =  mongoose.models.user ||  mongoose.model("User", userSchema);
export default UserModel;