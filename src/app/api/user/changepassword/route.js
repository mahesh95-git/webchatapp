import ApiResponse from "@/lib/apiResponse";
import { authMiddleware } from "@/lib/authMiddleware";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
export async function POST(req) {
  return authMiddleware(async (req) => {
    const body = await req.json();
    const userId = req.user._id;
    const { oldPassword, newPassword, confirmPassword } = body;
    const user = await User.findById(userId);
    if (!user) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "user not found",
        statusCode: 400,
      });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "old password is incorrect",
        statusCode: 400,
      });
    }
    if (newPassword !== confirmPassword) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "password and confirm password should be same",
        statusCode: 400,
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return new ApiResponse().sendResponse({
      success: true,
      message: "password changed successfully",
      statusCode: 200,
    });
  }, req);
}
