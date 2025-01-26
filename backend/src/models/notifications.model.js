import mongoose from "mongoose";

const userNotificationSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.ObjectId.type, ref: "User", required: true},
  notificationsType: {type: String, enum: ["ORDER_PLACED", "ORDER_DELIVERED", "ORDER_CANCELLED", "ORDER_SHIPPED", "PAYMENT_SUCCESSFUL", "PAYMENT_FAILED"], required: true},
  title: {type: String, required: true},
  message: {type: String, required: true},
  isRead: {type: Boolean, default: false},
  channel: {type: String, enum:["in-app", "email"], required:true, default: "in-app"},
},
{timeStamps : true}
)


export default mongoose.model("Usernotification", userNotificationSchema)