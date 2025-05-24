


//placing Order Using COD Method
const placeOrder = async (req, res) => {
    try{
        const { userId, items, amount, address } = req.body;

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





//placing Order Using Stripe Method
const placeOrderStripe = async (req, res) => {


}

//Placing Order Using Razorpay Method
const placeOrderRazorpay = async (req, res) => {

}


//ALL Orders Data for Admin Panel
const allOrders = async (req, res) => {

}


//User Order Data For Frontend
const userOrders = async (req, res) => {

}

// update order status
const updatedStatus = async (req, res) => {

}






export {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updatedStatus
}
