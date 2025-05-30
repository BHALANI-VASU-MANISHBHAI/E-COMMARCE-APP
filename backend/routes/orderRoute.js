import express from 'express';
import {    placeOrder,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updatedStatus,
    verifyOrderRazorpay
}  from '../controllers/orderControllers.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();


//Admin Features

orderRouter.post('/list',adminAuth, allOrders); //get all orders for admin
orderRouter.post('/status', adminAuth, updatedStatus); //update order status
  
//Payment Features
orderRouter.post('/place',authUser, placeOrder); 
orderRouter.post('/razorpay',authUser, placeOrderRazorpay);
orderRouter.post('/verify-order-razorpay', authUser, verifyOrderRazorpay); //create razorpay order


//User Features
orderRouter.post('/userorders', authUser, userOrders); //get user orders

export default orderRouter;