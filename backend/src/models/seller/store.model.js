import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
    clerkId: {type: String, required: true, unique: true},
    name: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    isVerified: { type: Boolean, default: false }
}, 
{ timestamps: true });

export default mongoose.model("Store", storeSchema)