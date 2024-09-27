import ApiResponse from "@/lib/apiResponse";
import { authMiddleware } from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnection";
import User from "@/models/user.model";

// send friend request
export async function POST(req) {
  try {
    return await authMiddleware(async (req) => {
      const userId = req.user._id;
      await dbConnect();
      const body = await req.json();
      const { friendId } = body;
      const user = await User.findOne({ _id: friendId });
      if (!user) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "user not found",
          statusCode: 400,
        });
      }
      const index = user.friendRequests.indexOf(userId);
      if (index !== -1) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "friend request already sent",
          statusCode: 400,
        });
      }

      user.friendRequests.push(userId);
      await user.save();
      return new ApiResponse().sendResponse({
        success: true,
        message: "friend request sent successfully",
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

// reject friend request
export async function PATCH(req) {
  try {
    return await authMiddleware(async (req) => {
      const userId = req.user._id;
      await dbConnect();
      const { friendId } = await req.json();
      const friend = await User.findOne({ _id: friendId });
      if (!friend) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "user not found",
          statusCode: 400,
        });
      }
      const user = await User.findOne({ _id: userId });
      const index = user.friendRequests.indexOf(friendId);
      if (index === -1) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "friend request not found",
          statusCode: 400,
        });
      }
      user.friendRequests.splice(index, 1);
      await user.save();
      return new ApiResponse().sendResponse({
        success: true,
        message: "friend request rejected successfully",
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

// get friend requests
export async function GET(req) {
  try {
    return await authMiddleware(async (req) => {
      const userId = req.user._id;
      await dbConnect();
      const request = await User.aggregate([
        {
          $match: {
            _id: userId,
          },
        },
        {
          $unwind: "$friendRequests",
        },
        {
          $lookup: {
            from: "users",
            localField: "friendRequests",
            foreignField: "_id",
            as: "friendRequests",
          },
        },
        {
          $sort: {
            createdAt: 1,
          },
        },
        {
          $project: {
            friendRequests: 1,
          },
        },
        {
          $unwind: "$friendRequests",
        },
        {
          $project: {
            _id: "$friendRequests._id",
            username: "$friendRequests.username",
            profilePic: "$friendRequests.profilePic",
          },
        },
      ]);

      return new ApiResponse().sendResponse({
        success: true,
        message: "friend requests fetched successfully",
        data: request,
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
