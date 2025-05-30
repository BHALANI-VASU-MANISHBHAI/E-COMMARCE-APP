import mongoose from "mongoose";
import Review from "../models/reviewModel.js";
import Order from "../models/orderModel.js";
import { ObjectId } from 'bson';

// Then use it like this:




// post a review
const addReview = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is set by authUser middleware
    const { productId,  rating, comment } = req.body;
    // console.log("addReview called with data:", req.body);
const order = await Order.findOne({
  userId,
  'items._id': productId  
}).populate('items._id', 'name price image');


if(!order) {
  return res.json({ success: false, message: 'you not give review you not ordered item ' });
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
    // console.log("Reviews found:", reviews);
    return res.json({ success: true, reviews });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: err.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    console.log("updateReview called with reviewId:", reviewId);
    const { rating, comment } = req.body;
 console.log("Update data:", req.body);
    const updatedReview = await Review.findByIdAndUpdate(reviewId,{
      rating,
      comment
    });
    console.log("Updated review:", updatedReview);
    return res.json({ success: true, message: 'Review updated successfully' });
  }catch (err) {  
    console.error(err);
    return res.json({ success: false, message: err.message });
  }

}
    


export {
    addReview,
    getReviews,
    updateReview
}

