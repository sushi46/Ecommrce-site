import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDefault: { type: Boolean, default: false },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    label: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
    phoneNumber: { type: String },
    instructions: { type: String }
}, { timestamps: true });


export default mongoose.model("Address", addressSchema)

