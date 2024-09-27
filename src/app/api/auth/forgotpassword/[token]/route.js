import ApiResponse from "@/lib/apiResponse";
import dbConnect from "@/lib/dbConnection";
import User from "@/models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
export async function POST(req, { params }) {
  const { token } = params;
  try {
    const body=await req.json();
    const {newPassword,confirmPassword}=body;

    await dbConnect();

    if (!token) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "Token is required",
        statusCode: 400,
      });
    }
    if(newPassword!==confirmPassword){
      return new ApiResponse().sendResponse({
        success: false,
        message: "password and confirm password should be same",
        statusCode: 400,
      });
    }
    let decoded;
    try {
      decoded=jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    } catch (error) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "Invalid or expired token",
        statusCode: 403,
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const user=await User.findOne({_id:decoded.id});
  
  if(!user){
    return new ApiResponse().sendResponse({
      success: false,
      message: "user not found",
      statusCode: 400,
    });
  }
  user.password=hashedPassword;
  user.resentToken=undefined;
  user.resetTokenExpires=undefined;
  await user.save();
  return new ApiResponse().sendResponse({
    success: true,
    message: "password reset successfully",
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
