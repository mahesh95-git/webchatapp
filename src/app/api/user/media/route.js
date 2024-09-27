import ApiResponse from "@/lib/apiResponse";
import { authMiddleware } from "@/lib/authMiddleware";
import { uploadMedia } from "@/lib/uploadMedia";
import Chat from "@/models/chat.model";
import Group from "@/models/group.model";
import Media from "@/models/media.model";
import User from "@/models/user.model";

export async function POST(req) {
    return authMiddleware(async (req) => {
      const formData = await req.formData();
      const file = formData.get("file");
      const receiver = formData.get("receiver");
      const type = formData.get("type") || "friend";
      if (!file) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "file not found",
          statusCode: 400,
        });
      }
      if (!receiver) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "receiver not found",
          statusCode: 400,
        });
      }
      if (type === "group") {
        const group = await Group.findOne({ _id: receiver });
        if (!group) {
          return new ApiResponse().sendResponse({
            success: false,
            message: "group not found",
            statusCode: 400,
          });
        }
      } else {
        const user = await User.findOne({ _id: receiver });
        if (!user) {
          return new ApiResponse().sendResponse({
            success: false,
            message: "user not found",
            statusCode: 400,
          });
        }
      }
      
     
      const result = await uploadMedia(file);
      const newMedia = await Chat.create({
        sender: req.user._id,
        ...(type === "group" ? { group: receiver } : { receiver }),
        media: {
          url: result.url,
          public_id: result.public_id,
        },
        message:" ",
        type: file.type.split("/")[0],
        isGroup: type === "group" ? true : false,
      });


      return new ApiResponse().sendResponse({
        success: true,
        message: "file uploaded successfully",
        statusCode: 200,
        data: newMedia,
      });
    }, req);
  
}
