import User from "../models/user.model.js";
import ApiError from "../utilities/apiError.js";
import ApiResponse from "../utilities/apiResponse.js";
import { wrapperFunction } from "../utilities/wrapper.js";



const registerUser = wrapperFunction(async (req, res)=> {
    
    const email = (req.body.email || req.params.email || req.query.email).trim();
    const password = req.body.password || req.params.password || req.query.password
    const authProvider = req.body.authProvider || req.params.authProvider || req.query.authProvider
    const authProviderID = req.body.authProviderID || req.params.authProviderID || req.query.authProviderID


    if( !email ){
       throw new ApiError(400, 
        "email is required"
       )
    }

    let existingUser;
    try {
        if (authProviderID) {
            existingUser = await User.findOne({
                $or: [{ email }, { authProviderID }]
            });
        } else {
            existingUser = await User.findOne({ email });
        }
    } catch (error) {
        throw new ApiError(500, "Database error while checking user existence");
    }

    if(existingUser){
        throw new ApiError(400, "user already exists with this email")
    }


   if(authProvider && authProviderID){
        const newUser = new User({
            email,
            authProvider,
            authProviderID,
        })
         
        await newUser.save()

        const response = ApiResponse.success("user registered successfully through OAuth", {
            id: newUser._id,
            email: newUser.email,
            authProvider: newUser.authProvider,
            authProviderID: newUser.authProviderID,
            role: newUser.role,
        });
    
        
        return res.status(201)
        .json(response.toJSON())
    }

    if(!password) {
       throw new ApiError(400, "Password is required")
    }

   
    const newUser = new User({
        email,
        authProvider : "local",
        password,
    })

    await newUser.save()

    const response = ApiResponse.success("User registered successfully", {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
    });

    return res.status(201)
    .json(response.toJSON())
 

})


export {registerUser} 