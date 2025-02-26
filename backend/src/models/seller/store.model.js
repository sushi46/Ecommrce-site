import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, // Links to User schema
    name: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String },
    addressLine: { type: String, required: true, maxLength: 100 },
    city: { type: String, required: true, maxLength: 50 },
    state: { type: String, required: true, maxLength: 50 },
    postalCode: { type: String, required: true, maxLength: 10, match: /^[A-Za-z0-9\s\-]+$/ },
    country: { type: String, required: true, maxLength: 50 },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true, maxLength: 15, match: /^\+?[1-9]\d{1,14}$/ },
    isVerified: { type: Boolean, default: false, index: true }
}, { timestamps: true });


export default mongoose.model("Store", storeSchema)