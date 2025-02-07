import mongoose from "mongoose";

const sellerEarningSchema = new mongoose.Schema({
    clerkId: {type: String, required: true, unique: true},
    amount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'paid'],
      default: 'pending'
    },
    bankDetails: {
      accountNumber: { type: String, required: true },
      bankName: { type: String, required: true },
      holderName: { type: String, required: true }
    },
    paidAt: { type: Date }
  },
{ timestamps: true });

export default mongoose.model("SellerEarnings", sellerEarningSchema)



  