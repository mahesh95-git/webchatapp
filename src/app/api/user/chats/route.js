import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnection";
import Chat from "@/models/chat.model";
import ApiResponse from "@/lib/apiResponse";
import { authMiddleware } from "@/lib/authMiddleware";
import Group from "@/models/group.model";
import User from "@/models/user.model";

// get chats
export async function GET(req) {
  try {
    return await authMiddleware(async (req) => {
      const { searchParams } = new URL(req.url);
      const limit = parseInt(searchParams.get("limit")) || 20;
      const page = parseInt(searchParams.get("page")) || 1;
      const receiver = searchParams.get("receiver");
      const groupId = searchParams.get("group");
      const isGroup = !!groupId;
      const skip = (page - 1) * limit;
      const sender = req.user._id;

      await dbConnect();

      if ((!sender && !receiver) || (isGroup && !groupId)) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "Invalid request parameters",
          statusCode: 400,
        });
      }

      const matchStage = isGroup
        ? {$and:[
          {
            group: new mongoose.Types.ObjectId(groupId) 
          },{
            isDeleted: { $nin: [req.user._id] }
          }
        ]}
        : {
            $or: [
              {
                $and: [
                  { sender: new mongoose.Types.ObjectId(sender) },
                  { receiver: new mongoose.Types.ObjectId(receiver) },
                  { isDeleted: { $nin: [req.user._id] } },
                ],
              },
              {
                $and: [
                  { sender: new mongoose.Types.ObjectId(receiver) },
                  { receiver: new mongoose.Types.ObjectId(sender) },
                  { isDeleted: { $nin: [req.user._id] } },
                ],
              },
            ],
          };

      const userLookup = [
        {
          $lookup: {
            from: "users",
            localField: "receiver",
            foreignField: "_id",
            as: "receiver",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "sender",
            foreignField: "_id",
            as: "sender",
          },
        },
      ];

      const projectStage = isGroup
        ? {
            $project: {
              sender: {
                _id: "$sender._id",
                username: "$sender.username",
                profilePic: "$sender.profilePic",
              },
              type: 1,
              media: 1,
              message: 1,
              isGroup: 1,
              createdAt: 1,
            },
          }
        : {
            $project: {
              sender: {
                _id: "$sender._id",
                username: "$sender.username",
                profilePic: "$sender.profilePic",
              },
              receiver: {
                _id: "$receiver._id",
                username: "$receiver.username",
                profilePic: "$receiver.profilePic",
              },
              type: 1,
              media: 1,
              message: 1,
              isGroup: 1,
              createdAt: 1,
            },
          };

      const unwindStages = isGroup
        ? [{ $unwind: "$sender" }]
        : [{ $unwind: "$sender" }, { $unwind: "$receiver" }];

      const pipeline = [
        { $match: matchStage },
        ...userLookup,
        ...unwindStages,
        projectStage,
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ];

      const chats = await Chat.aggregate(pipeline);
      const totalChats = await Chat.countDocuments(matchStage);

      let info = {};
      if (isGroup) {
        const group = await Group.findById(groupId);
        if (!group) {
          return new ApiResponse().sendResponse({
            success: false,
            message: "Group not found",
            statusCode: 404,
          });
        }
        info = {
          name: group.name,
          profilePic: group.profilePic,
          members: group.members,
          _id: group._id,
          totalChats,
        };
      } else {
        const friend = await User.findById(receiver);
        if (!friend) {
          return new ApiResponse().sendResponse({
            success: false,
            message: "User not found",
            statusCode: 404,
          });
        }
        info = {
          username: friend.username,
          profilePic: friend.profilePic,
          _id: friend._id,
          totalChats,
        };
      }

      const newChat = {
        ...info,
        data: chats,
      };

      return new ApiResponse().sendResponse({
        success: true,
        message: "Chats fetched successfully",
        data: newChat,
        statusCode: 200,
      });
    }, req);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return new ApiResponse().sendResponse({
      success: false,
      message: "Internal server error",
      statusCode: 500,
    });
  }
}

// clear all chats
export async function DELETE(req) {
  try {
    return await authMiddleware(async (req) => {
      await dbConnect();
      const body = await req?.json();
      const { receiver, groupId } = body;
      const isGroup = groupId ? true : false;
      const sender = req.user._id;
      if (!receiver && !groupId) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "Invalid request parameters",
          statusCode: 400,
        });
      }
      const matchStage = isGroup
        ? { group: new mongoose.Types.ObjectId(groupId) }
        : {
            $or: [
              {
                $and: [
                  { sender: new mongoose.Types.ObjectId(sender) },
                  { receiver: new mongoose.Types.ObjectId(receiver) },
                ],
              },
              {
                $and: [
                  { sender: new mongoose.Types.ObjectId(receiver) },
                  { receiver: new mongoose.Types.ObjectId(sender) },
                ],
              },
            ],
          };
      const chats = await Chat.find(matchStage);
      if (!chats.length) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "Chats not found",
          statusCode: 404,
        });
      }
      const saveOperations = [];
      let isChats = false;
      if (chats.length) {
        chats.forEach((chat) => {
          if (!chat.isDeleted.includes(sender)) {
            isChats = true;
            if (chat.isDeleted.length == 1) {
              saveOperations.push(chat.deleteOne());
            } else {
              chat.isDeleted.push(new mongoose.Types.ObjectId(sender));
            }

            saveOperations.push(chat.save());
          }
        });
      }

      if (!isChats) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "Chats not found",
          statusCode: 404,
        });
      }

      await Promise.all(saveOperations);
      return new ApiResponse().sendResponse({
        success: true,
        message: "Chats and Media deleted successfully",
        statusCode: 200,
      });
    }, req);
  } catch (error) {
    return new ApiResponse().sendResponse({
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
}
