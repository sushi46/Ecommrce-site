import mongoose from "mongoose";

const SellerOrderSchema = new mongoose.Schema({
    clerkId: {type: String, unique: true, required: true},
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    products: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    }
}, { timestamps: true });
  
export default mongoose.model("SellerOrder", SellerOrderSchema)