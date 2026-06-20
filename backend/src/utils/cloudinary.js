import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary= async function(localFilePath){
    console.log("Uploading file from path:", localFilePath);
    try {
        if(!localFilePath) return null
        // upload file on cloudinary
        const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        // delete the file from local storage
        fs.unlinkSync(localFilePath)
        // file has been uploaded
        console.log(`file has been uploaded successfully on cloudinary! ${response.url}`);
        return response;
        
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export {uploadOnCloudinary}