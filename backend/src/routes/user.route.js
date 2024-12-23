import { Router } from "express"
import { registerUser } from "../controllers/user.controller.js"
import { registerRateLimiter } from "../middlewares/rateLimitmiddleware.js"

const router = Router()

router.route("/register").post(registerRateLimiter, registerUser)

export default router