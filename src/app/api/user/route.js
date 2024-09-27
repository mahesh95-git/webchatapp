import ApiResponse from "@/lib/apiResponse";
import { authMiddleware } from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnection";
import { uploadMedia } from "@/lib/uploadMedia";
import User from "@/models/user.model";

// delete account
export async function DELETE(req) {
  return await authMiddleware(async (req) => {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "user not found",
        statusCode: 400,
      });
    }
    await user.remove();
    return new ApiResponse().sendResponse({
      success: true,
      message: "account deleted successfully",
      statusCode: 200,
    });
  }, req);
}
// get profile
export async function GET(req) {
  return await authMiddleware(async (req) => {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "user not found",
        statusCode: 400,
      });
    }

    return new ApiResponse().createJwtToken({
      id: user._id,
      username: user.username,
    }).sendResponse({
      success: true,
      message: "profile fetched successfully",
      statusCode: 200,
      data: user,
    });
  }, req);
}

// update profile
export async function PATCH(req) {
  return await authMiddleware(async (req) => {
    const userId = req.user._id;
    const formData = await req.formData();

    const username = formData.get("username");
    const about = formData.get("about");
    const email = formData.get("email");
    const profilePic = formData.get("profilePic");


    const user = await User.findById(userId);
    let profilePicUrl;

    if (profilePic && profilePic !== "null") {
      profilePicUrl = await uploadMedia(profilePic);
    }

    user.username = username;
    user.about = about;
    user.email = email;

    if (profilePicUrl) {
      user.profilePic = {
        url: profilePicUrl.url,
        publicId: profilePicUrl.publicId,
      };
    }

    const updatedUser = await user.save({ new: true });

    return new ApiResponse().sendResponse({
      success: true,
      message: "Profile updated successfully",
      data: {
        username: updatedUser.username,
        about: updatedUser.about,
        email: updatedUser.email,
        ...(profilePicUrl && { profilePic: profilePicUrl.url }),
      },
      statusCode: 200,
    });
  }, req);
}
