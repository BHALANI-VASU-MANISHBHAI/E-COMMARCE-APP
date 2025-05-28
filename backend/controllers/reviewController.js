import mongoose from "mongoose";
import Review from "../models/reviewModel.js";
import Order from "../models/orderModel.js";
import { ObjectId } from 'bson';

// Then use it like this:




// post a review
const addReview = async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;
    console.log("addReview called with data:", req.body);
const order = await Order.findOne({
  userId,
  'items._id': productId  
}).populate('items._id', 'name price image');
console.log(order);

if(!order) {
  return res.json({ success: false, message: 'you not give review' });
}
    const reviewData = new Review({
      productId,
      userId,
      rating,
      comment
    });

    const newReview = await Review.create(reviewData);
    await newReview.save();


return res.json({ success: true, order });
 
    

  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: err.message });
  }
};

// get reviews for a product
const getReviews = async (req, res) => {
  try {
    const { productId } = req.params; 
    

    const reviews = await Review.find({ productId }).populate('userId', 'name email'); // Populate userId with name and email
    console.log("Reviews found:", reviews);
    return res.json({ success: true, reviews });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: err.message });
  }
};


export {
    addReview,
    getReviews
}

