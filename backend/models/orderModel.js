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
    required: true
  },
  paymentMethod: { 
    type: String, 
    required: true 
  },
  payment: {
    method: { type: String },
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
    required: true 
  },

  // ✅ New fields for cancellation tracking:
  cancelledBy: {
    type: String,
    enum: ['user', 'admin', 'system', null], // Add 'system' if you plan to auto-cancel unpaid orders
    default: null
  },
  cancelledAt: { 
    type: Date, 
    default: null 
  },
  cancellationReason: { 
    type: String, 
    default: '' 
  }
});

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;
