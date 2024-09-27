import apiResponse from "@/lib/apiResponse";
import dbConnect from "@/lib/dbConnection";
import User from "@/models/user.model";
import jwt from "jsonwebtoken";

export async function POST(req, { params }) {
  const { token } = params;

  try {
    await dbConnect();

    if (!token) {
      return new apiResponse(req).sendResponse({
        success: false,
        message: "Token is required",
        statusCode: 400,
      });
    }

    // Verify the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    } catch (error) {
      return new apiResponse(req).sendResponse({
        success: false,
        message: "Invalid or expired token",
        statusCode: 403,
      });
    }

    // Fetch the user by email from the decoded token
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return new apiResponse(req).sendResponse({
        success: false,
        message: "User not found",
        statusCode: 404,
      });
    }

    if (user.isVerified) {
      return new apiResponse(req).sendResponse({
        success: false,
        message: "Email already verified",
        statusCode: 403,
      });
    }

    if (user.verificationToken !== token) {
      return new apiResponse(req).sendResponse({
        success: false,
        message: "Invalid token",
        statusCode: 403,
      });
    }

    if (user.verificationTokenExpires < Date.now()) {
      return new apiResponse(req).sendResponse({
        success: false,
        message: "Verification token expired, please request a new one",
        statusCode: 400,
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationTokenExpires = undefined;
    user.verificationToken = undefined;
    await user.save();

    // Create a new JWT token for the user
    return new apiResponse(req)
      .createJwtToken({
        id:user._id.toString(),
        username:user.username
      })
      .sendResponse({
        success: true,
        message: "Email verified successfully",
        statusCode: 200,
      });
  } catch (error) {
    console.error("Error during verification:", error);
    return new apiResponse(req).sendResponse({
      success: false,
      message: `Error during verification, please try again: ${error.message}`,
      statusCode: 500,
    });
  }
}
