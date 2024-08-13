import dbConnect from "@/lib/dbConnection";
import Chat from "@/models/chat.model";
import ApiResponse from "@/lib/apiResponse";
import User from "@/models/user.model";
import Media from "@/models/media.model";
export async function GET(req){
    try {
        const {senderId,receiverId} = await req.json();
        await dbConnect();
        const chats = await Chat.find({$and:[{sender:senderId,receiver:receiverId},{sender:receiverId,receiver:senderId}]});
        const media=await Media.find({$and:[{sender:senderId,receiver:receiverId},{sender:receiverId,receiver:senderId}]})
        return new ApiResponse().sendResponse({
            success: true,
            message: "Chats fetched successfully",
            data: chats,
            statusCode: 200,
        });
    } catch (error) {
        
    }
}