import {  createClerkClient } from "@clerk/express";
import ApiError from "./apiError.js";

const clerkClient =  createClerkClient({
    publishableKey: process.env.CLERKPUBLISHABLEKEY,
    secretKey: process.env.CLERKSECRETKEY,
})

const clerkAuth = async (req, res, next) => {
    try {
        const clientToken = req.headers.authorization;
        if (!clientToken) {
            throw new ApiError(401, "No authorization token provided");
        }
        
        // If token is in "Bearer <token>" format, extract the token
        const token = clientToken.split(' ')[1] || clientToken;
        
        const session = await clerkClient.sessions.verifyToken(token);
        req.auth = session;
        next();
    } catch (error) {
      console.log("Authentication failed")
      next(new ApiError(401, "Invalid or expired token"))
      return
    }
}

export {clerkClient, clerkAuth}