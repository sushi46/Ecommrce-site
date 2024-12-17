import { v2 as cloudinary} from "cloudinary"
import fs from "fs"
import ApiError from "./apiError";
import ApiResponse from "./apiResponse";



cloudinary.config({ 
    cloud_name:  process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadFileOnCloudinary = async (localFilePath) => {
   try {
    if(!localFilePath) {
        throw new ApiError(404, "File path missing")
    }
   
    const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
    })

    console.log(`file uploaded on cloudinary`, uploadResponse.url)
    return new ApiResponse(200, "File uploaded successfully", {
        url: uploadResponse.url,
        public_id: uploadResponse.public_id,
    })

   } catch (error) {
   
    console.error('Cloudinary Upload Error:', error.message)

    if(localFilePath && fs.existsSync(localFilePath)){
       fs.unlinkSync(localFilePath)
       console.log(`local path deleted due to upload failure : ${localFilePath}`)
    }

    throw new ApiError(
        500,
        'Failed to upload file to Cloudinary. Please try again later.',
        error
    );
   }
}

export default uploadFileOnCloudinary