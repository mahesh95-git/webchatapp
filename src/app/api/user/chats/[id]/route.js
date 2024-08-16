import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnection";
import Media from "@/models/media.model";
import Chat from "@/models/chat.model";
import ApiResponse from "@/lib/apiResponse";

// delete single media and chat
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const userId = "66b7761e584864ad7bf02321";
    const chat = await Chat.findOne({
      _id: id,
    });
    const media = await Media.findOne({
      _id: id,
    });

    if (!chat && !media) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "Chat not found",
        statusCode: 404,
      });
    }
    if (chat) {
      if (chat.isDeleted.length === 2) {
        await chat.remove();
       
      }else{

        chat.isDeleted.push(new mongoose.Types.ObjectId(userId));
        await chat.save();
      }
    }
    if (media) {
      if (media.isDeleted.length === 2) {
        await media.remove();

      }else{

        media.isDeleted.push(new mongoose.Types.ObjectId(userId));
        await chat.save();
      }

    }
    return new ApiResponse().sendResponse({
      success: true,
      message: "Chat deleted successfully",
      statusCode: 200,
    });
  } catch (error) {
    return new ApiResponse().sendResponse({
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
}
