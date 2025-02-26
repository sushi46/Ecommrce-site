
//import clerkClient from "../utilities/authservice.js";
import { wrapperFunction } from "../utilities/wrapper.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js"
import Address from "../models/address.model.js"
import UserNotifications from "../models/notifications.model.js"
import ApiResponse from "../utilities/apiResponse.js";
import ApiError from "../utilities/apiError.js";


const protect = wrapperFunction(async(req, res) => {
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")

      res.json({
          message: "This is a protected route",
          userId: userId
      });

})




//controller for getting user orders

const getOrders = wrapperFunction(async(req, res) => {
    
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const startDate = parseInt(req.query.startDate )
    const endDate = parseInt(req.query.endDate)
    const statuses = req.query.statuses
    
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")

    if(!userId){
        throw ApiError.notFound("User not found or Invalid userId")
    }



    const queryObject = {user : userId}

    queryObject.latestVersion = true

    if(statuses && Array.isArray(statuses) && statuses.length > 0){
      queryObject.statuses = {$in : statuses}
    }


    if( startDate || endDate ){
      if(!startDate) throw ApiError.badRequest("start date is required")
      
      if(!endDate) throw ApiError.badRequest("end date is required")
    
      queryObject.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }  
      
    }
  

    const skip = (page - 1) * limit
    const totalOrders = await Order.countDocuments(queryObject)

    const orders = await Order.find(queryObject).populate("products.product").skip(skip).limit(limit)


    if (totalOrders === 0) {
      const orderResponse = ApiResponse.success(
        "Looks like you haven't placed any orders yet",
        [],
        {
          totalOrders: 0,
          currentPage: page,
          totalPages: 0,
          orderCount: 0
        }
      );
      return res.status(200).json(orderResponse.toJSON());
    }


    const orderResponse = ApiResponse.success(
      "Here are your orders!",
      orders,
      {
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        orderCount: orders.length
      }
    );

    return res.status(200).json(orderResponse.toJSON())

})



//controller for getting an order

const orderDetalis = wrapperFunction(async(req, res) => {
    const {orderId} = req.params
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")

    if(!userId){
    throw ApiError.notFound("User not found or invalid userId")
    }

    const orderDetails = await Order.findOne({orderId, user: userId})

    const response = ApiResponse.success("OrderDetails fetched successfully",
      orderDetails
    )

    return res.status(200).json(response.toJSON())

})


//controller for placing order

const placeOrder = wrapperFunction(async(req, res) => {
    const {products, totalPrice, shippingDetails,paymentMethod, paymentStatus} = req.body
    
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")

    if(!userId){
    throw ApiError.notFound("User not found or invalid userId")
    }
  
  
    if(paymentMethod === " COD"){
      
      const newOrder = new Order ( {
        user: userId,
        products,
        totalPrice,
        shippingDetails,
        orderStatus: "placed", 
        paymentMethod,
        paymentStatus,
        previousVersion: null,
        latestVersion: true
      })
      
      await newOrder.save()

      const newNotification = new UserNotifications({
        user: userId,
        notificationsType: "ORDER_PLACED",
        title: "Order placed",
        message: `Your orderId ${newOrder.orderId} is confirmed`  
      })

    
      await newNotification.save()


      io.to(`User_${userId}`).emit("new-notification", {
        user: userId,
        title: "Order placed",
        message: `Your orderId ${newOrder.orderId} is confirmed` 
      })
      

      const response = ApiResponse.success("Order placed successfully",
        newNotification,
      )

      return res.status(200).json(response.toJSON())

    } else if(paymentMethod === "Stripe"){
      
      const newOrder = new Order ( {
        user: userId,
        products,
        totalPrice,
        shippingDetails,
        orderStatus,
        paymentMethod,
        paymentStatus,
        previousVersion: null,
        latestVersion: true
      })
      
      await newOrder.save()
      
      return res.redirect(`/stripe-checkout`)

    } else {
      throw ApiError.internal("Error creating order")
    }
    
})




// controller for getting all the saved addresses

const getAddress = wrapperFunction(async(req, res) => {
  const clerkId = req.auth.userId
  const user = await User.findOne({clerkId})

  if(!user){
  throw ApiError.notFound("User not found")
  }


   const userAdress = await User.findOne({clerkId}).populate("addresses").select("addresses")

   if (!userAdress) {
    throw ApiError.notFound("User adress not found")
    }

    if (!userAdress?.length) {
        const response = ApiResponse.success(
            "No saved addresses found",
            [],
            { totalAddresses: 0 }
        );
        return res.status(200).json(response.toJSON());
    }

    const response = ApiResponse.success(
        "Addresses retrieved successfully",
        userAdress,
        { totalAddresses: userAdress.length }
    );

    return res.status(200).json(response.toJSON());

})



//controller for adding a new address

const addAddress = wrapperFunction(async(req, res) => {

    const clerkId = req.auth.userId
    const user = await User.findOne({clerkId})

    if(!user){
    throw ApiError.notFound("User not found")
    }


    const {addressLine, city, state, postalCode, country, label, phoneNumber, instructions} = req.body

    if(!addressLine || !city || !state || !postalCode || !country || !label || !phoneNumber){
      
      const response =  ApiResponse.error("Please fill all the necessary fields")
      return res.status(400).json(response.toJSON())
    }
    
    const validLabels = ["home", "work", "other"];
      if (!validLabels.includes(label)) {
        const response = ApiResponse.error("Invalid label value. Accepted values: home, work, other.");
        return res.status(400).json(response.toJSON());
      }

    
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phoneNumber)) {
        const response = ApiResponse.error("Invalid phone number format");
        return res.status(400).json(response.toJSON());
      }

      const postalCodeRegex = /^[A-Za-z0-9\s\-]+$/;
      if (!postalCodeRegex.test(postalCode)) {
        const response = ApiResponse.error("Invalid postal code format");
        return res.status(400).json(response.toJSON());
      }

      const newAddress = new Address({
          user: user._id,
          addressLine,
          city,
          state,
          country,
          postalCode,
          label,
          phoneNumber,
          instructions: instructions || null,
      })

      await newAddress.save()

      const response = ApiResponse.success("Address created successfully", newAddress)

      return res.status(201).json(response.toJSON())

})


//controller for getting user notifications
const getAllNotifications = (async(req, res)=> {

  
    const limit = parseInt(req.query.limit) || 10

    
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")

    if(!userId){
    throw ApiError.notFound("User not found or Invalid user")
    }

    
    const notifications = await UserNotifications.find({user : userId}).sort({createdAt : -1}).limit(limit)
  
    if(!notifications){
      throw ApiError.notFound("failed to find notifications")
    }

    const response = ApiResponse.success("notifications fetched successfully")

    return res.status(200).json(response.toJSON())


})




export {protect, getOrders, getAddress, addAddress, orderDetalis, placeOrder, getAllNotifications} 