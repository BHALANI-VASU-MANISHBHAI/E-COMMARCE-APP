import express from 'express';
import {    placeOrder,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updatedStatus,
    verifyOrderRazorpay,
    cancelOrderItem,cancelAllOrders,
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
orderRouter.post('/cancel', authUser, cancelOrderItem); //cancel order
orderRouter.post('/cancelAll', authUser, cancelAllOrders); //cancel all orders


export default orderRouter;