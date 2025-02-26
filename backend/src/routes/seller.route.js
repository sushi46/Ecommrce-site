import { Router } from "express"
import { sellerDetails, updateInfo, getAllProducts, productDetails, addProduct, updateProduct, 
    removeProduct, listOrders, updateStatus, shipOrder, cancelOrder, deliverOrder, lifetimeEarnings,
    dailyEarnings, weeklyEarnings, monthlyEarnings, customEarnings, getPayoutLifetime, getPayoutCustom,
    earningDetails} from "../controllers/seller.controller.js"

const router = Router()

//profile and management

router.route("/seller_profile").get(sellerDetails)

router.route("/seller_profile/update").post(updateInfo)

// product management

router.route("/all_products").get(getAllProducts)

router.route("/product_details/:id").get(productDetails)

router.route("/add_product").post(addProduct)

router.route("update_product/:id").put(updateProduct)

router.route("/remove_product/:id").delete(removeProduct)


// order management

router.route("/orders_list").get(listOrders)

router.route("/order_status/:id").put(updateStatus)

router.route("/order_status/:id/shipped").post(shipOrder)

router.route("/order_status/:id/cancel").post(cancelOrder)

router.route("/order_status/:id/delivered").post(deliverOrder)

// fincancial status

router.route("/earnings").get(earningDetails)

router.route("/earnings/daily").get(dailyEarnings)

router.route("/earnings/weekly").get(weeklyEarnings)

router.route("/earnings/monthly").get(monthlyEarnings)

router.route("/earnings/lifetimeEarnings").get(lifetimeEarnings)

router.route("/earnings/custom").get(customEarnings)

router.route("/payout/month").get(getPayoutCustom)

router.route("/payout/lifetime").get(getPayoutLifetime)

//reviews and feedback

router.route("/reviews").get(getReviews)

router.route("/review_response/:id/respond").post(reviewResonse)


export default router