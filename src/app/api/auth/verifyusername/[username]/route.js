import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnection";
import ApiResponse from "@/lib/apiResponse";
export async function POST(req, { params }) {
  const { username } = params;
  try {
    await dbConnect();
    const user = await User.findOne({ username });
    if (user) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "username already exists",
        statusCode: 400,
      });
    }
    console.log(user);
    return new ApiResponse().sendResponse({
      success: true,
      message: "username available",
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
