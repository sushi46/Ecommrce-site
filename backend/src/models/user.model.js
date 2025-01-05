import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    fullName: { type: String},
    email: { type: String, required:true, unique: true},
    password: { type: String },
    phone: { type: String },
    address: { type: String },
    profilePicture: { type: String},
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
}, { timestamps: true });




export default mongoose.model("User", userSchema)