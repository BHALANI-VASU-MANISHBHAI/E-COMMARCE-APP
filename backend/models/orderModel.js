import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true  
  },
  items: {
    type: Array,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  address: {
    type: Object,
    required: true
  },
  status: {
    type: String,
    enum: ['Order Placed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'Order Placed',
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true
  },
  payment: {
    method: { type: String },                // e.g. "razorpay"
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String }
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },
  date: {
    type: Date,
    required: true,
  }
});

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;
