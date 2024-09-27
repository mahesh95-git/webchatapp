import ApiResponse from "@/lib/apiResponse";
import { authMiddleware } from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnection";
import { newChat } from "@/lib/helperFunction/createChat";
import User from "@/models/user.model";
import mongoose from "mongoose";

export async function GET(req) {
    return await authMiddleware(async (req) => {
      const userId = req.user._id;
      const chats = await User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "friends",
            foreignField: "_id",
            as: "friends",
          },
        },
        {
          $addFields: {
            friends: {
              type:"friend",
            },
        }
      },
        {
          $lookup: {
            from: "groups",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { 
                    $or: [
                      { $in: ["$$userId", "$members"] },
                      { $in: ["$$userId", "$admin"] },
                    ],
                  },
                },
              },
            ],
            as: "groups",
          },
        },
        {
          $addFields: {
            groups: {
              type:"group",
            },
          },
        },
        {
          $addFields: {
            combined: {
              $concatArrays: ["$friends", "$groups"],
            },
          },
        },
        {
          $addFields: {
            combined: {
              $sortArray: {
                input: "$combined",
                sortBy: { createdAt: -1 }
              }
            },
          },
        },{
          $project: {
            combined: {
              _id: 1,
              name: 1,
              type: 1,
              username: 1,
              profilePic: 1,
              createdAt: 1,
            },
          },
        },{
          $unwind: "$combined",
        },{
          $replaceRoot: {
            newRoot: "$combined",
          },
        }
      ]);
      
      
      return new ApiResponse().sendResponse({
        success: true,
        message: "Chats fetched successfully",
        data: chats,
        statusCode: 200,
      });
    }, req);

}
