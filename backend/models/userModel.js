import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        default: "",
    },
    lastName: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () { return !this.googleId; }, // ✅ Conditionally required
    },
    googleId: { // ✅ Add this field
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
        unique: true,
    },
    address: {
        type: String,
        default: "",
    },
    cartData: {
        type: Object,
        default: {},
    },
    profilePhoto: {
        type: String,
        default: "https://res.cloudinary.com/drezv2fgf/image/upload/v1748439973/Profile_avatar_placeholder_large_px5gio.png"
    },

}, { minimize: false, timestamps: true });

const UserModel = mongoose.models.user || mongoose.model("User", userSchema);
export default UserModel;
