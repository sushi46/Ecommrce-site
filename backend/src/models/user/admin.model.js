import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['superadmin'], default: 'superadmin' },
    permissions: [{ type: String }], // e.g., ['manageProducts', 'manageOrders']
}, { timestamps: true });


export default mongoose.model("Admin", adminSchema)