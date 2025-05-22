import mongoose from "mongoose";

// _id: "aaaaf",
//         name: "Girls Round Neck Cotton Top",
//         description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//         price: 140,
//         image: [p_img6],
//         category: "Kids",
//         subCategory: "Topwear",
//         sizes: ["S", "L", "XL"],
//         date: 1716623423448,
//         bestseller: true


const productSchema = mongoose.Schema({
name :{
    type: String,
    required: true,
},
description:{
    type: String,
    required: true,
},
price:{
    type: Number,
    required: true,
},
image:{
    type: Array,
    required: true,
},
category:{
    type: String,
    required: true,
},
subCategory:{
    type: String,
    required: true,
},
sizes:{
    type: Array,
    required: true,
},
bestseller:{
    type: Boolean,
    default: false,
},
date:{
    type: Number,
    default: Date.now(),
},
}, {
    timestamps: true,
})
 // 1st argument is the name of the collection in the database, 2nd argument is the schema   
const ProductModel =  mongoose.models.product ||  mongoose.model("Product", productSchema);
// if the model is already created, it will use that model instead of creating a new one. This is useful in Next.js to avoid the "Duplicate model error" when using the same model in different files.
export default ProductModel;