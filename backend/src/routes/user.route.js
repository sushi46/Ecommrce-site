import { Router } from "express"
import {  protect, registerUser } from "../controllers/user.controller.js"
import { clerkAuth } from "../utilities/authservice.js"
import { verify } from "jsonwebtoken"


const router = Router()

router.route("/protect").get(clerkAuth, protect)

//user account and preferences related routes

router.route("/orders").get(clerkAuth, verifyEmail)

router.route("/addresses").post(clerkAuth, verifyEmail)

router.route("/addresses").get(clerkAuth, verifyEmail)

export default router