import orderModel from '../models/orderModel.js';
import UserModel from '../models/userModel.js';
import razorpayInstance from '../config/razorPay.js';


//placing Order Using COD Method
const placeOrder = async (req, res) => {
    try{
        const userId = req.userId; 
        const {  items, amount, address } = req.body;
        console.log("placeOrder called with data:", req.body);
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
            payment: false,
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
    const { amount, currency, receipt, orderData } = req.body;

    const options = {
      amount: amount * 100, // in paisa
      currency,
      receipt,
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) return res.status(500).json({ success: false, message: "Razorpay order failed" });

    res.status(200).json({
      success: true,
      razorpayOrder: order,
      key: process.env.RAZORPAY_KEY_ID,
      orderData
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error in Razorpay order" });
  }
};

const verifyOrderRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (sign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const newOrder = new OrderModel({
      ...orderData,
      payment: {
        method: "razorpay",
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
      status: "processing",
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
    const orders = await orderModel.find({userId});
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






export {
    placeOrder,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updatedStatus,
    verifyOrderRazorpay
}
