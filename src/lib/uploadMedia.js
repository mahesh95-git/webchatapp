import { v2 as cloudinary } from "cloudinary";
export const uploadMedia = async function (file) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    let type;
    if (file.type.startsWith("image")) {
      type = "image";
    } else if (file.type.startsWith("video")) {
      type = "video";
    } else {
      type = "raw";
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: type,
          folder: "webChatApp",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
