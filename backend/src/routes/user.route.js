import { Router } from "express"
import {  protect, getOrders, getAddress, addAddress, orderDetalis, placeOrder, getAllNotifications } from "../controllers/user.controller.js"


const router = Router()

router.route("/protect").get(protect)

//user account and preferences related routes

router.route("/add-address").post(addAddress)

router.route("/address").get(getAddress)

router.route("/theme_preference").post(themePreference) // not complete

// user oder management

router.route("/orders/user").get(getOrders)

router.route("/orders/:id").get(orderDetalis)

router.route("/orders/place").post(placeOrder)

router.route("/order/:id/cancel").post(cancelOrder) // not complete

router.route("/order_notifications").get(getAllNotifications)



export default router