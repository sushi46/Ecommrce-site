import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDefault: { type: Boolean, default: false },
    addressLine: { type: String, required: true , maxLength: 100},
    city: { type: String, required: true, maxLength: 50},
    state: { type: String, required: true, maxLength: 50},
    postalCode: { type: String, required: true, maxLength: 10, match: /^[A-Za-z0-9\s\-]+$/ },
    country: { type: String, required: true , maxLength: 50},
    label: { type: String, enum: ['home', 'work', 'other'], default: 'home', required: true },
    phoneNumber: { type: String, maxLength: 15 , match: /^\+?[1-9]\d{1,14}$/, required: true},
    instructions: { type: String, maxLength: 200 }
}, { timestamps: true });


export default mongoose.model("Address", addressSchema)

