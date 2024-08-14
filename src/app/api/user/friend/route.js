import dbConnect from "@/lib/dbConnection";
import User from "@/models/user.model";

// add friend
export async function POST(req) {
  try {
    const userId = "66b7761e584864ad7bf02321";
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
        message: "friend not found",
        statusCode: 400,
      });
    }
    const user = await User.findOne({ _id: userId });
    user.friends.push(friendId);
    await user.save();

    return new ApiResponse().sendResponse({
      success: true,
      message: "friend added successfully",
      statusCode: 200,
    });
  } catch (error) {
    return new ApiResponse().sendResponse({
      success: false,
      message: error,
      statusCode: 500,
    });
  }
}

// get friends
export async function GET(req) {
  try {
    const userId = "66b7761e584864ad7bf02321";

    await dbConnect();

    const friends = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $unwind: "$friends",
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
        $unwind: "$friends",
      },
      {
        $project: {
          _id: "$friends._id",
          username: "$friends.username",
          profilePic: "$friends.profilePic",
        },
      },
    ]);

    return new ApiResponse().sendResponse({
      success: true,
      message: "friends fetched successfully",
      data: friends,
      statusCode: 200,
    });
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
    await dbConnect();
    const userId = "66b7761e584864ad7bf02321";
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
    await User.updateOne(
      { _id: userId },
      { $pull: { friends: friendId } }
    );

    return new ApiResponse().sendResponse({
      success: true,
      message: "friend removed successfully",
      statusCode: 200,
    });
  } catch (error) {
    return new ApiResponse().sendResponse({
      success: false,
      message: error,
      statusCode: 500,
    });
  }
}



