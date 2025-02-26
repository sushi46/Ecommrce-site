import { wrapperFunction } from "../utilities/wrapper"
import Store from "../models/seller/store.model"
import ApiResponse from "../utilities/apiResponse"
import ApiError from "../utilities/apiError"
import Product from "../models/seller/product.seller.model.js"
import SellerProduct from "../models/seller/product.seller.model.js"
import Order from "../models/user/order.model.js"
import User from "../models/user/user.model.js"
import { getStartDateAndEndDdate, calculateEarnings, getStartweekAndEndWeek, getStartMonthAndEndMonth } from "../utilities/earningsCalculator/earnings.js"

const sellerDetails = wrapperFunction(async(req, res) => {
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})

    if(!userStore){
      throw ApiError.notFound("User not found")
    }

    const response = ApiResponse.success("Seller details fetched successfully",
      userStore    )
    
    return res.status(200).json(response.toJSON())
})


const updateInfo = wrapperFunction(async(req, res)=>{
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})
    const {name, description, logo, addressLine, city, state, postalCode, country, contactEmail, contactPhone} = req.body

    if(!userStore){
      throw ApiError.notFound("could't find store associated with the user")
    }

      
    if(!name || !description || !logo || !addressLine || !city || !postalCode || !state || !country || !contactEmail || !contactPhone){
      return ApiResponse.error("all fields are required to be verified")
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(contactPhone)) {
      const response = ApiResponse.error("Invalid phone number format");
      return res.status(400).json(response.toJSON());
    }

    const postalCodeRegex = /^[A-Za-z0-9\s\-]+$/;
    if (!postalCodeRegex.test(postalCode)) {
      const response = ApiResponse.error("Invalid postal code format");
      return res.status(400).json(response.toJSON());
    }

    await Store.findOneAndUpdate({userId}, {isVerified: true}, {new: true, runValidators: true})
    
    const response = ApiResponse.success("Info updated successfully")
    return res.status(201).json(response.toJSON())
  
})



const getAllProducts = wrapperFunction(async(req, res) => {
  const clerkId = req.auth.userId
  const userId = await User.findOne({clerkId}).select("_id")
  const userStore = await Store.findOne({userId})
  const {catagory, status} = req.query
  const limit = parseInt(req.query.limit, 10) || 10
  const page = parseInt(req.query.page, 10) || 1

 
  if(!userStore){
    throw ApiError.notFound("Store not found for the user")
  }
  
  const queryObject = {storeId: userStore._id}

  const catagories = ["male" , "female"]

  if(catagories.includes(catagory)){
     queryObject.catagory = catagory
  }
  
  const statuses = ["in-stock", "Out-of-stock"]

  if(statuses.includes(status)){
    queryObject.status = status
  }
 

  const skip = ( page - 1 ) * limit
  const totalproducts = await Product.countDocuments(queryObject)

  const products = await Product.find(queryObject).skip(skip).limit(limit)

  const response = ApiResponse.success("Products fetched successfully",
    products,
    {
      totalProducts: totalproducts,
      metaMessage: `Total ${totalproducts} products found for your query`
    }
  ) 
  
  return res.status(200).json(response.toJSON())

})


const productDetails = wrapperFunction(async(req, res)=> {
  const clerkId = req.auth.userId
  const userId = await User.findOne({clerkId}).select("_id")
  const userStore = await Store.findOne({userId})
  const productId = req.params.id

  if(!userStore){
    throw ApiError.notFound("Store not found for thhe user")
  }

  if(!productId || !mongoose.Types.ObjectId.isValid(productId)){
    throw ApiError.badRequest("Invalid product ID")
  }

  const storeId = userStore._id
  
  const singleProductDetails = await SellerProduct.findById({_id : productId, storeId})

  if(!singleProductDetails){
    throw ApiError.notFound("Product does not exist")
  }

  const productData = ApiResponse.success("Product Details fetched sucessfully",
    singleProductDetails
  )

  return res.status(200).json(productData.toJSON())

})


const addProduct = wrapperFunction(async(req, res) => {
  
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})
    const { name, description, price, catagory, quantity, images, status} = req.body
    const storeId = userStore._id

    if(!userStore){
      throw ApiError.notFound("store not found for the user")
    }


    if(!name || !description || !price || !catagory || !quantity || !images || !status){
      throw ApiError.badRequest("Fill all the fields to add a product")
    }

    const addedProduct = new SellerProduct ({
      storeId, 
      name,
      description, 
      discountedPrice, 
      catagory, 
      quantity, 
      images, 
      status, 
      stock
    })

    await addedProduct.save()

    const response = ApiResponse.success("Product added Successfully")
    return res.status(201).json(response.toJSON())

})


const updateProduct = wrapperFunction(async(req, res) => {
  
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})
    const { name, description, price, catagory, quantity, images, status} = req.body
    const productId = req.params.id

    if(!productId || !mongoose.Types.ObjectId.isValid(productId)){
    throw ApiError.badRequest("Invalid product ID")
    }

    if(!userStore){
      throw ApiError.notFound("store not found for the user")
    }

    if(!name || !description || !price || !catagory || !quantity || !images || !status){
      throw ApiError.badRequest("Fill all the fields to Update a product")
    }

    const storeId = userStore._id
    const updateFields = {
      name,
      description,
      price, 
      catagory,
      quantity,
      images,
      status,
    }

    const updatedProductDetails = await SellerProduct.findOneAndUpdate({_id: productId, storeId: storeId}, updateFields , {new: true, runValidators: true})
    
    
    if(!updatedProductDetails){
      throw ApiResponse.badRequest("Could not find the product to update")
    }

    const response = ApiResponse.success("Product updated successfully", 
      updatedProductDetails
    )
    return res.status(201).json(response.toJSON())
  
})


const removeProduct = wrapperFunction(async(req, res) => {
  
    const productId = req.params.id
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})
    
    
    if(!userStore){
      throw ApiError.notFound("Store not found for the user")
    }

    const storeId = userStore._id

    if(!productId || !mongoose.Types.ObjectId.isValid(productId)){
      throw ApiError.badRequest("Invalid product ID")
    }
    
    const deletedProduct = await SellerProduct.findOneAndDelete({_id: productId, storeId})

    if(!deletedProduct){
      throw ApiError.notFound("Product not found or already deleted")
    }

    const response = ApiResponse.success("Product deleted successfully")

    return res.status(200).json(response.toJSON())

})



const listOrders = wrapperFunction(async(req,res)=> {
    const limit = parseInt(req.query.limit, 10) || 10
    const page = parseInt(req.query.page, 10) || 1
    const skip = (page - 1) * limit
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})

    if(!userStore){
      throw ApiError.notFound("Store not found for the user")
    }

    const allProducts = await Order.find({user: userId, store: userStore._id}).skip(skip).limit(limit)
    

    if(!allProducts){
      throw ApiError.unprocessableEntity("Failed to get Orders")
    }

    const response = ApiResponse.success("Orders fetched successfully", 
      allProducts
    )
   

    return res.status(200).json(response.toJSON())

})


const updateStatus = wrapperFunction(async(req, res)=> {
    const orderId = req.params.id
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})


   if(!orderId ) {
      throw ApiError.badRequest("Order Id not found or Invalid")
   }
   
   if(!userStore){
     throw ApiError.notFound("Store not found for the user")
   }


   const orderUpdateStatus = await Order.findOne({orderId}).select("orderStatus")

   if(!orderUpdateStatus){
     throw ApiError.notFound("couldn't get order update status")
   }

   const response = ApiResponse.success("Order status fetched successfully", 
    orderUpdateStatus
   )
   
   return res.status(200).json(response.toJSON())

})



const shipOrder = wrapperFunction(async(req, res) => {
    const orderId = req.params.id
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})
    const orderStatus = req.query.status

   const statuses = ["pending", "shipped", "delivered", "cancelled", "placed"] 

    if(!orderId ) {
      throw ApiError.badRequest("Order Id not found or Invalid")
    }
    
    if(!userStore){
      throw ApiError.notFound("Store not found for the user")
    }

    if(!orderStatus || !statuses.includes(orderStatus)){
      throw ApiError.notFound("Order status not available or Invalid order status")
    }

    if(orderStatus !== "shipped"){
      throw ApiError.badRequest("Could not update the status of the order")
    } 

    const response = ApiResponse.success(`Your order status has been updated to "SHIPPED"`)
    return res.status(201).json(response.toJSON())

})


const cancelOrder = wrapperFunction(async(req, res) => {
    const orderId = req.params.id
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})
    const orderStatus = req.query.status

  const statuses = ["pending", "shipped", "delivered", "cancelled", "placed"] 

   if(!orderId ) {
     throw ApiError.badRequest("Order Id not found or Invalid")
   }
   
   if(!userStore){
     throw ApiError.notFound("Store not found for the user")
   }

   if(!orderStatus || !statuses.includes(orderStatus)){
     throw ApiError.notFound("Order status not available or Invalid order status")
   }

   if(orderStatus !== "cancelled"){
     throw ApiError.badRequest("Could not update the status of the order")
   } 

   const response = ApiResponse.success(`Your order status has been updated to "CANCELLED"`)
   return res.status(201).json(response.toJSON())

})


const deliverOrder = wrapperFunction(async(req, res) => {
    const orderId = req.params.id
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})
    const orderStatus = req.query.status

    const statuses = ["pending", "shipped", "delivered", "cancelled", "placed"] 

    if(!orderId ) {
      throw ApiError.badRequest("Order Id not found or Invalid")
    }
    
    if(!userStore){
      throw ApiError.notFound("Store not found for the user")
    }

    if(!orderStatus || !statuses.includes(orderStatus)){
      throw ApiError.notFound("Order status not available or Invalid order status")
    }

    if(orderStatus !== "delivered"){
      throw ApiError.badRequest("Could not update the status of the order")
    } 

    const response = ApiResponse.success(`Your order status has been updated to "CANCELLED"`)
    return res.status(201).json(response.toJSON())

})


const lifetimeEarnings = wrapperFunction(async(req, res) => {
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})

    if(!userStore){
      throw ApiError.notFound("Store not found for the user")
    }

    const deliveredOrders = await Order.find({ store: userStore._id, status: "delivered" }).select("totalPrice");

    if(!deliveredOrders || deliveredOrders.length < 1){
      throw ApiError.notFound("No orders found for the query")
    }

    const sellersLifetimeEarnings = calculateEarnings(deliveredOrders)
    
    return sellersLifetimeEarnings
})


const dailyEarnings = wrapperFunction(async(req, res) => {
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})
    const date = req.query.date

    if(!userStore){
      throw ApiError.notFound("Store not found for the user")
    }

    let selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      selectedDate = new Date();
      selectedDate.setDate(selectedDate.getDate() - 1); 
    }

    const earningsDate = await getStartDateAndEndDdate(selectedDate)
    
    if(!earningsDate){
      throw ApiError.notFound("Couldn't get the earning's dates")
    }

    const queryObject = { store: userStore._id, status: "delivered",
                        createdAt: {$gte: new Date(earningsDate.startOfDay),
                        $lte: new Date(earningsDate.endOfDay)}}

    const dailyEarningsValue = await Order.find(queryObject).select("totalPrice")  

    if(!dailyEarningsValue || dailyEarningsValue.length < 1){
      throw ApiError.notFound("No orders found for the query")
    }
    
    const calculatedDailyEarning = calculateEarnings(dailyEarningsValue)
    
    return calculatedDailyEarning

})



const weeklyEarnings = wrapperFunction(async(req, res)=> {
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})
    const date = req.query.date

    if(!userStore){
      throw ApiError.notFound("Store not found for the user")
    }

    let selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      selectedDate = new Date();
      selectedDate.setDate(selectedDate.getDate() - selectedDate.getDate() - 6); 
    }

    const weeklyEarningDate = await getStartweekAndEndWeek(selectedDate)
    
    if(!weeklyEarningDate){
      throw ApiError.notFound("Couldn't get weekly earning dates")
    }

    const queryObject = {store: userStore._id, orderStatus: "delivered", createdAt: {$gte: weeklyEarningDate.startOfWeek, $lte: weeklyEarningDate.endOfWeek}}

    const weeklyEarningsValue = await Order.find(queryObject).select("totalPrice")

    if(!weeklyEarningsValue || weeklyEarningsValue.length < 1){
      throw ApiError.notFound("Order not found for the query")
    }

    const calculatedWeeklyEarnings = calculateEarnings(weeklyEarningsValue)

    return calculatedWeeklyEarnings
})



const monthlyEarnings = wrapperFunction(async(req, res)=> {
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})
    const date = req.query.date

    if(!userStore){
      throw ApiError.notFound("Store not found for the user")
    }

    let selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      selectedDate = new Date();
      selectedDate.setDate(selectedDate.getMonth() - 1, 1); 
    }

    const monthlyEarningDate = await getStartMonthAndEndMonth(selectedDate)

    if(!monthlyEarningDate){
      throw ApiError.notFound("Couldn't get monthly earning dates")
    }

    const queryObject = { store: userStore._id, orderStatus: "delivered", createdAt: {$gte: monthlyEarningDate.startOfMonth, $lte: monthlyEarningDate.endOfMonth}}

    const monthlyEarningsValue = await Order.find(queryObject).select("totalPrice")

    if(!monthlyEarningsValue || monthlyEarningsValue.length < 1){
      throw ApiError.notFound("couldn't find orders for the query")
    }

    const calculatedMonthlyEarnings = calculateEarnings(monthlyEarningsValue)

    return calculatedMonthlyEarnings

})


const earningDetails = wrapperFunction(async(req, res)=> {
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})
    const { type } = req.query;

    if(!userStore){
      throw ApiError.notFound("Store not found for the user")
    }
    

    if(!["day", "week", "month", "lifetime"].includes(type)){
      throw ApiError.badRequest("Invalid type")
    }

      let earningsData;

      switch (type) {
        case "day":
          earningsData = await dailyEarnings(req, res);
          break;
        case "week":
          earningsData = await weeklyEarnings(req, res);
          break;
        case "month":
          earningsData = await monthlyEarnings(req, res);
          break;
        case "lifetime":
          earningsData = await lifetimeEarnings(req, res);
          break;
        default:
          earningsData = await lifetimeEarnings(req, res)
          break;
      }
      
      const response = ApiResponse.success("Earnings fetched successfully", earningsData);
      return res.status(200).json(response.toJSON())
      
})

const customEarnings = wrapperFunction(async(req, res)=> {
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})

    let { month, year } = req.query; 

      if (!userStore) {
          throw ApiError.notFound("Store not found for the user");
      }

    
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1; 

      year = parseInt(year, 10);
      month = parseInt(month, 10);

      if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
          throw ApiError.badRequest("Invalid month or year format.");
      }

      
      if (year === currentYear && month >= currentMonth) {
          throw ApiError.badRequest("Earnings data unavailable for the current or future months.");
      }
    

      const startDate = new Date(year, month - 1, 1); 
      const endDate = new Date(year, month, 1); 

      const customEarnings = await Order.find({
          storeId: userStore._id,
          orderStatus: "delivered",
          createdAt: { $gte: startDate, $lt: endDate },
      }).select("totalPrice"); 

    const calculatedCustomEarnings = calculateEarnings(customEarnings)

    if(!calculatedCustomEarnings){
      throw ApiError.notFound("Earnings details not found for the month")
      }
      
    const response = ApiResponse.success("Earnings fetched successfully", calculatedCustomEarnings)

    return res.status(200).json(response.toJSON())
   
})



const getPayoutLifetime = wrapperFunction(async(req, res) => {
    const clerkId = req.auth.userId
    const userId = await User.findOne({clerkId}).select("_id")
    const userStore = await Store.findOne({userId})

    if (!userStore) {
      throw ApiError.notFound("Store not found for the user");
    }
    
    const totalPayout = await lifetimeEarnings(req, res)

    if(!totalPayout){
      throw ApiError.notFound("Total payout details unavailable or not found")
    }

    const response = ApiResponse.success("Payout details fetched successfully", totalPayout)
    
    return res.status(200).json(response.toJSON())

})



const getPayoutCustom = wrapperFunction(async(req, res) => {
  const clerkId = req.auth.userId
  const userId = await User.findOne({clerkId}).select("_id")
  const userStore = await Store.findOne({userId})
  const { month , year } = req.query
 
  if (!userStore) {
    throw ApiError.notFound("Store not found for the user");
  }

  const monthlyPayout = await customEarnings(req, res)

  if(!monthlyPayout){
    throw ApiError.notFound("Monthly payout details unavailable or not found")
  }

  const response = ApiResponse.success("Payout details fetched successfully", monthlyPayout)
  
  return res.status(200).json(response.toJSON())

})



export {sellerDetails, updateInfo, getAllProducts, productDetails, addProduct, updateProduct, 
removeProduct, listOrders, updateStatus, shipOrder, cancelOrder, deliverOrder, lifetimeEarnings,
dailyEarnings, weeklyEarnings, monthlyEarnings, customEarnings, getPayoutLifetime, getPayoutCustom,
earningDetails}