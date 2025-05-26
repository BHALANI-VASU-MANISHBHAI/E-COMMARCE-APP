import orderModel from '../models/orderModel.js';
import UserModel from '../models/userModel.js';


//placing Order Using COD Method
const placeOrder = async (req, res) => {
    try{
        const { userId, items, amount, address } = req.body;
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





//Placing Order Using Razorpay Method
const placeOrderRazorpay = async (req, res) => {

}


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
    const { userId } = req.body;
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
    updatedStatus
}
