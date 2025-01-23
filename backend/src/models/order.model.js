import mongoose from "mongoose";
import generateCustomerId from "../utilities/customerIDgenerator";

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'shipped', 'delivered', 'cancelled'], 
        default: 'pending' 
    },
    shippingDetails: {type: mongoose.Schema.types.ObjectId, ref: "Address", required: true},
    paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
    customerId: { type: String, required: true, unique: true },
}, { timestamps: true });





orderSchema.pre("save", function(){
    if(!this.customerId){
      this.customerId = generateCustomerId()
    }

    next()
})


export  default mongoose.model("Order", orderSchema)