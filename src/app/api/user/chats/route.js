import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnection";
import Chat from "@/models/chat.model";
import ApiResponse from "@/lib/apiResponse";
import Media from "@/models/media.model";
// get chats
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 20;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    await dbConnect();
    const body = await req.json();
    const { sender, receiver, isGroup, groupId } = body;
    if ((!sender && !receiver) ||(isGroup&&!groupId)) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "Invalid request parameters",
        statusCode: 400,
      });
    }

    const matchStage = isGroup
      ? { group: mongoose.Types.ObjectId(groupId) }
      : {
          sender: mongoose.Types.ObjectId(sender),
          receiver: mongoose.Types.ObjectId(receiver),
        };

    const lookupUsersStage = [
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiver",
          foreignField: "_id",
          as: "receiver",
        },
      },
    ];

    const lookupMediaStage = {
      $lookup: {
        from: "media",
        let: isGroup
          ? { groupId: mongoose.Types.ObjectId(groupId) }
          : { sender: mongoose.Types.ObjectId(sender), receiver: mongoose.Types.ObjectId(receiver) },
        pipeline: [
          {
            $match: {
              $expr: isGroup
                ? { $eq: ["$group", "$$groupId"] }
                : {
                    $and: [
                      { $eq: ["$sender", "$$sender"] },
                      { $eq: ["$receiver", "$$receiver"] },
                    ],
                  },
            },
          },
        ],
        as: "media",
      },
    };

    const projectStage = {
      $project: {
        sender: { name: 1, profilePic: 1, _id: 1 },
        receiver: { name: 1, profilePic: 1, _id: 1 },
        media: 1,
        message: 1,
        createdAt: 1,
      },
    };

    const chats = await Chat.aggregate([
      { $match: matchStage },
      ...lookupUsersStage,
      lookupMediaStage,
      projectStage,
      { $skip: skip },
      { $limit: limit },
    ]);

    return new ApiResponse().sendResponse({
      success: true,
      message: "Chats fetched successfully",
      data: chats,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return new ApiResponse().sendResponse({
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
}
// clear all chats
export async function DELETE(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { sender, receiver, groupId, userId } = body;

    const chats = await Chat.find({
      $or: [
        { group: groupId },
        {
          $and: [{ sender }, { receiver }],
        },
      ],
    });
    
    const media = await Media.find({
      $or: [
        { group: groupId },
        {
          $and: [{ sender }, { receiver }],
        },
      ],
    });

    if (!chats.length && !media.length) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "Chats and Media not found",
        statusCode: 404,
      });
    }

    const saveOperations = [];

    if (chats.length) {
      chats.forEach((chat) => {
        if (!chat.isDeleted.includes(userId)) {
          chat.isDeleted.push(new mongoose.Types.ObjectId(userId));
          saveOperations.push(chat.save());
        }
      });
    }

    if (media.length) {
      media.forEach((item) => {
        if (!item.isDeleted.includes(userId)) {
          item.isDeleted.push(new mongoose.Types.ObjectId(userId));
          saveOperations.push(item.save());
        }
      });
    }

    await Promise.all(saveOperations);

    return new ApiResponse().sendResponse({
      success: true,
      message: "Chats and Media deleted successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return new ApiResponse().sendResponse({
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
}