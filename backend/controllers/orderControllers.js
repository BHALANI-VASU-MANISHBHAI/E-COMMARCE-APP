import orderModel from '../models/orderModel.js';
import UserModel from '../models/userModel.js';
import razorpayInstance from '../config/razorPay.js';
import crypto from 'crypto';



//placing Order Using COD Method
const placeOrder = async (req, res) => {
    try{
        const userId = req.userId; 
        const {  items, amount, address } = req.body;
        if(!userId || !items || !amount || !address){
            return res.json({success: false, message: 'All fields are required'});
        }

        const orderData = {
            userId,
            items,
            amount,
            address,
            status: 'Order Placed',
            paymentMethod: 'COD',
            payment: {  
                method: 'cod',
                razorpay_order_id: null,
                razorpay_payment_id: null,
                razorpay_signature: null
            },
            date: new Date()
        };

        const newOrder = await orderModel.create(orderData);
       
         await newOrder.save();

         await UserModel.findByIdAndUpdate(userId, {cartData:{}}); 
        
         res.json({success:true , message:"Order placed successfully"});
     

    }catch(err){
        console.log(err);
        return res.json({success: false, message: err.message});
    }


}





 const placeOrderRazorpay = async (req, res) => {
  try {
    const { amount, currency = "INR", orderData } = req.body;

  
    const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const options = {
      amount: amount * 100, 
      currency,
      receipt,
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.status(500).json({ success: false, message: "Razorpay order failed" });
    }

    res.status(200).json({
      success: true,
      razorpayOrder: order,
      key: process.env.RAZORPAY_KEY_ID,
      orderData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error in Razorpay order" });
  }
};


const verifyOrderRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (sign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
    console.log("Payment verified successfully");
    const newOrder = new orderModel({
      ...orderData,
      payment: {
        method: "razorpay",
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
      status: "Order Placed",
      paymentStatus: "success",
      paymentMethod: "Razorpay",
      date: orderData.date || new Date(),
      userId: req.userId, 
    });

    await newOrder.save();
    res.status(200).json({ success: true, message: "Payment verified and order placed" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};



//ALL Orders Data for Admin Panel
const allOrders = async (req, res) => {
    
    try{
        const orders  = await orderModel.find({});

        res.json({success: true, orders});
    }catch(err){
        console.log(err);
        return res.json({success: false, message: err.message});
    }
}


//User Order Data For Frontend
const userOrders = async (req, res) => {
 try{
    const userId = req.userId;
    const orders = await orderModel.find({userId
      ,
        status: { $ne: 'cancelled' } // Exclude cancelled orders
    }).sort({date: -1});
  
    res.json({success: true, orders});
 }catch(err){
    console.log(err);
    return res.json({success: false, message: err.message});
 }
}

// update order status
const updatedStatus = async (req, res) => {
 try{
    const {orderId, status} = req.body;

    await orderModel.findByIdAndUpdate(orderId, {status});
    res.json({success: true, message: "Order status updated successfully"});
 }catch(err){
    console.log(err);
    return res.json({success: false, message: err.message});
 }
}
// Cancel a specific item in an order (by itemId and size)
 const cancelOrderItem = async (req, res) => {
  try {
    const { orderId, itemId, size, reason } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Filter out the item with the specific itemId and size
    const updatedItems = order.items.filter(item => {
      return !(item._id.toString() === itemId && item.size === size);
    });

    // If no items remain, mark the order as cancelled
    if (updatedItems.length === 0) {
      order.status = 'cancelled';
      order.cancelledBy = 'user';
      order.cancelledAt = new Date();
      order.cancellationReason = reason || '';
    }

    order.items = updatedItems;

    console.log("Updated Order after item cancellation:", order);

    await order.save();

    return res.json({ success: true, message: "Item cancelled successfully" });
  } catch (error) {
    console.error("Cancel order item error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export {
    placeOrder,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updatedStatus,
    verifyOrderRazorpay,
    cancelOrderItem
}
