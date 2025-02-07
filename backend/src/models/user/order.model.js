import mongoose from "mongoose";
import generateOrderId from "../../utilities/customerIDgenerator.js";

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    orderStatus: { 
        type: String, 
        enum: ["pending", "shipped", "delivered", "cancelled", "placed"],
        default: "pending" 
    },
    shippingDetails: {type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true},
    paymentMethod: {type: String, enum: ["COD", "Stripe"]},
    paymentStatus: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    orderId: { type: String, unique: true },
    previousVersion : { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true},
    latestVersion : { type: Boolean, default: true}
}, { timestamps: true });





orderSchema.pre("save", function(next){
    if(!this.orderId){
      this.orderId = generateOrderId()
    }

    next()
})


export  default mongoose.model("Order", orderSchema)