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
    enum: ['Order Placed', 'Shipped', 'Delivered', 'Cancelled', 'Out for delivery', 'Packing'],
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
  cancelledBy: {
    type: String,
    enum: ['user', 'admin', 'system', null],
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

// ✅ Add this: Compound index on paymentStatus and status
orderSchema.index({ paymentStatus: 1, status: 1 });

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;
