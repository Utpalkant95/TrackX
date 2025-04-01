import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMedia = async (file: string) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "image",
      folder: "trackx",
    });

    return uploadResponse;
  } catch (error) {
    console.log("error in uploading media", error);
  }
};

export const deleteMediaFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log("error in deleting media from cloudinary", error);
  }
};