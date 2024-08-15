import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnection";
import Chat from "@/models/chat.model";
import ApiResponse from "@/lib/apiResponse";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 20;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    await dbConnect();
    const body = await req.json();
    const { sender, receiver, isGroup, groupId } = body;

    let chats;
    if (isGroup) {
      chats = await Chat.aggregate([
        {
          $match: { group: mongoose.Types.ObjectId(groupId) },
        },
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
        {
          $lookup: {
            from: "media",
            let: { groupId: mongoose.Types.ObjectId(groupId) },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$group", "$$groupId"],
                  },
                },
              },
            ],
            as: "media",
          },
        },
        {
          $project: {
            sender: {
              name: 1,
              profilePic: 1,
              _id: 1,
            },
            receiver: {
              name: 1,
              profilePic: 1,
              _id: 1,
            },
            media: 1,
            message: 1,
            createdAt: 1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);
    } else {
      chats = await Chat.aggregate([
        {
          $match: {
            sender: mongoose.Types.ObjectId(sender),
            receiver: mongoose.Types.ObjectId(receiver),
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
            from: "media",
            let: {
              sender: mongoose.Types.ObjectId(sender),
              receiver: mongoose.Types.ObjectId(receiver),
            },
            pipeline: [
              {
                $match: {
                  $expr: {
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
        },
        {
          $project: {
            sender: {
              name: 1,
              profilePic: 1,
              _id: 1,
            },
            receiver: {
              name: 1,
              profilePic: 1,
              _id: 1,
            },
            media: 1,
            message: 1,
            createdAt: 1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);
    }

    return new ApiResponse().sendResponse({
      success: true,
      message: "Chats fetched successfully",
      data: chats,
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
