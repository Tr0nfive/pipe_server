
import {v2 as cloudinary} from "cloudinary"
import multer, { memoryStorage } from "multer"


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})



export class Upload {

    
    storage = multer.memoryStorage()
    saveToRam = multer({storage : this.storage})
    
    
}