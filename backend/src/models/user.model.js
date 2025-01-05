import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
    fullName: { type: String},
    email: { type: String, required:true, unique: true},
    password: { type: String },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
}, { timestamps: true });


userSchema.pre("save", async function (next){
  if(!this.isModified("password")) return next()

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
  const result = await bcrypt.compare(password, this.password)
  return result
}

userSchema.methods.generateAccessToken = function () {
     return jwt.sign(
        {
            _id : this._id,
            email: this.email,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET, 
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET, 
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export default mongoose.model("User", userSchema)