const cloudinary = require("cloudinary").v2;
const cloudinaryConfig = require('../Config/cloudinaryConfig')

cloudinary.config(cloudinaryConfig)

uploadToCloudinary = async (path, folder) =>{
    try {
        const data = await cloudinary.uploader.upload(path,{ 
            folder: folder,
            secure:true
        });
        return {url: data.secure_url, public_id: data.public_id};
    } catch (error) {
        throw error;
    }
}

removeFromCloudinary = async (public_id) =>{
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    uploadToCloudinary,
    removeFromCloudinary
}