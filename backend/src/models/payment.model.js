import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    paymentMethod: { type: String, enum: ['COD', 'stripe'], required: true },
    transactionId: { type: String, required: true },
    paymentStatus: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },

}, { timestamps: true });


export default paymentSchema

