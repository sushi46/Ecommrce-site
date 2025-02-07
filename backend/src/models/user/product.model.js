import mongoose  from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: String },
    quantity: { type: Number, required: true },
    images: [{ type: String }],
    status: { type: String, enum: ['in stock', 'out of stock'], default: 'in stock' },
}, { timestamps: true });


export default mongoose.model("Product", productSchema)