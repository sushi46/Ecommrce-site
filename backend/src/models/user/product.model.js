import mongoose  from "mongoose";

const productSchema = new mongoose.Schema({
    store: {type: mongoose.Schema.Types.ObjectId, ref: "Store"},
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, enum: ["male", "female"], required: true },
    quantity: { type: Number, required: true },
    images: [{
        url: { type: String, required: true }, 
        publicId: { type: String, required: true }, 
        format: { type: String }
      }],
    status: { type: String, enum: ['in stock', 'out of stock'], default: 'in stock' },
}, { timestamps: true });


export default mongoose.model("Product", productSchema)