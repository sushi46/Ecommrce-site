//import clerkClient from "../utilities/authservice.js";
import { wrapperFunction } from "../utilities/wrapper.js";


const protect = wrapperFunction(async(req, res) => {
  const userId = req.auth?.userId;
    res.json({
        message: "This is a protected route",
        userId: userId
    });

})


const profile = wrapperFunction(async(req, res) => {
  
})



export {registerUser, protect} 