import multer from "multer"
import path from "path"
import {v4 as uuidv4} from "uuid"
import ApiError from "../utilities/apiError"


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../../public/temp" ))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + uuidv4())
    }
})
  
export const upload = multer({ 
    storage,
    limits: 5 * 1024 * 1024, 
    fileFilter: ( req, file, cb) => {
        const imageTypes = ["image/jpeg", "image/png"]

        if(!imageTypes.includes(file.mimetype)) {
            return cb(ApiError.unprocessableEntity('Invalid file type. Only JPEG and PNG are allowed'), false)
        }

        cb(null, true)
    }
})

