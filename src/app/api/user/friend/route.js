import ApiResponse from "@/lib/apiResponse";
import { authMiddleware } from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnection";
import Media from "@/models/media.model";
import Chat from "@/models/chat.model";
import User from "@/models/user.model";
import mongoose from "mongoose";

// add friend
export async function POST(req) {
  try {
    return await authMiddleware(async (req) => {
      const userId = req.user._id;
      const body = await req.json();
      const { friendId } = body;
      await dbConnect();
      if (!friendId) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "friendId is required",
          statusCode: 400,
        });
      }
      const friend = await User.findOne({ _id: friendId });
      if (!friend) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "user not found",
          statusCode: 400,
        });
      }
      const user = await User.findOne({ _id: userId });
      if (!user.friendRequests.includes(friendId)) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "friend request not sent",
          statusCode: 400,
        });
      }
      user.friendRequests = user.friendRequests.filter((id) => {
        return id.toString() !== friendId;
      });

      user.friends.push(friendId);
      friend.friends.push(userId);
      await Promise.all([user.save(), friend.save()]);

      return new ApiResponse().sendResponse({
        success: true,
        message: "friend added successfully",
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

// get friends
export async function GET(req) {
  try {
    return await authMiddleware(async (req) => {
      const userId = req.user._id;

      await dbConnect();

      const friends = await User.aggregate([
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
          $project: {
            friends: 1,
          },
        },
        {
          $addFields: {
            type:"friend"
          }

        },
        {
          $unwind: "$friends",
        },
        {
          $project: {
            _id: "$friends._id",
            username: "$friends.username",
            profilePic: "$friends.profilePic",
            type:"$type"
            
          },
        },
      ]);

      return new ApiResponse().sendResponse({
        success: true,
        message: "friends fetched successfully",
        data: friends,
        statusCode: 200,
      });
    }, req);
  } catch (error) {
    return new ApiResponse().sendResponse({
      success: false,
      message: error,
      statusCode: 500,
    });
  }
}

// remove friend
export async function PATCH(req) {
  try {
    return await authMiddleware(async (req) => {
      await dbConnect();
      const userId = req.user._id;
      const body = await req.json();
      const { friendId } = body;

      const friend = await User.findOne({ _id: friendId });
      if (!friend) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "friend not found please provide valid friend ID",
          statusCode: 400,
        });
      }

      const user = await User.findOne({ _id: userId });
      if (!user.friends.includes(friendId)) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "friend not found",
          statusCode: 400,
        });
      }
      user.friends.splice(user.friends.indexOf(friendId), 1);
      friend.friends.splice(friend.friends.indexOf(userId), 1);
      let promise = [
        user.save(),
        friend.save(),
        Chat.deleteMany({
          $and: [
            {
              sender: userId,
            },
            {
              receiver: friendId,
            },
          ],
        }),
        Media.deleteMany({
          $and: [
            {
              sender: userId,
            },
            {
              receiver: friendId,
            },
          ],
        }),
      ];

      await Promise.all(promise);
      return new ApiResponse().sendResponse({
        success: true,
        message: "friend removed successfully",
        statusCode: 200,
      });
    }, req);
  } catch (error) {
    return new ApiResponse().sendResponse({
      success: false,
      message: error,
      statusCode: 500,
    });
  }
}
