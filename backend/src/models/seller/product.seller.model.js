import mongoose from "mongoose";

const SellerProductSchema = new mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    category: { type: String, required: true },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    status: { 
      type: String, 
      enum: ['active', 'outOfStock', 'draft'],
      default: 'draft'
    }
}, 
{ timestamps: true });
  

export default mongoose.model("SellerProduct", SellerProductSchema)