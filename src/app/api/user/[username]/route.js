import ApiResponse from "@/lib/apiResponse";
import { authMiddleware } from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnection";
import User from "@/models/user.model";

export async function GET(req, { params }) {
  try {
    return await authMiddleware(
      async (req, params) => {
        const id=req.user._id
        await dbConnect();
        const { username } = params;
        const user = await User.find({ username: { $regex: username, $options: "i" } }).select("_id username profilePic");
        const newUser = user.filter((u) => u._id.toString() !== id.toString());
        if (!newUser) {
          return new ApiResponse().sendResponse({
            success: false,
            message: "user not found",
            statusCode: 400,
          });
        }

        return new ApiResponse().sendResponse({
          success: true,
          data: newUser,
          message: "user found",
          statusCode: 200,
        });
      },
      req,
      params
    );
  } catch (error) {
    return new ApiResponse().sendResponse({
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
}
