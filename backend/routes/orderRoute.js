import express from 'express';
import {    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updatedStatus}  from '../controllers/orderControllers.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();


//Admin Features

orderRouter.post('/list',adminAuth, allOrders); //get all orders for admin
orderRouter.post('/status', adminAuth, updatedStatus); //update order status
  
//Payment Features
orderRouter.post('/place',authUser, placeOrder); 
orderRouter.post('/stripe',authUser, placeOrderStripe);
orderRouter.post('/razorpay',authUser, placeOrderRazorpay);


//User Features
orderRouter.post('/userorders', authUser, userOrders); //get user orders

export default orderRouter;