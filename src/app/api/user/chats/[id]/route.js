import mongoose from "mongoose";
import Chat from "@/models/chat.model";
import ApiResponse from "@/lib/apiResponse";
import { authMiddleware } from "@/lib/authMiddleware";

// delete single media and chat
export async function DELETE(req, { params }) {
  return authMiddleware(async (req) => {
    const { id } = params;
    const userId = req.user._id;
    const chat = await Chat.findOne({
      _id: id,
    });
    if (!chat) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "Chat not found",
        statusCode: 404,
      });
    }
    if (!chat.isGroup) {
      if (chat.isDeleted.length === 2) {
        await chat.deleteOne({
          validateBeforeSave: false,
        });
      } else {
        chat.isDeleted.push(new mongoose.Types.ObjectId(userId));
        await chat.save({
          validateBeforeSave: false,
        });
      }
    } else {
      chat.isDeleted.push(new mongoose.Types.ObjectId(userId));
      await chat.save({
        validateBeforeSave: false,
      });
    }

    return new ApiResponse().sendResponse({
      success: true,
      message: "Chat deleted successfully",
      statusCode: 200,
    });
  }, req);
}
