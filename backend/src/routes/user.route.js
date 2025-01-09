import { Router } from "express"
import {  protect, registerUser } from "../controllers/user.controller.js"
import { clerkAuth } from "../utilities/authservice.js"


const router = Router()

router.route("/register").post(registerUser)

router.route("/protect").get(clerkAuth, protect)

export default router