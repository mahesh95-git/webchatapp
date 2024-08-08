import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnection";
import bcrypt from "bcryptjs";
import User from "@/models/user.model";
import loginSchema from "@/zodSchema/login.Schema";
import ApiResponse from "@/lib/apiResponse";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const zodRes = loginSchema.safeParse(body);

    if (!zodRes.success) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "Please provide valid information.",
        data: zodRes.error,
        statusCode: 400,
      });
    }

    const loginUser = await User.findOne({ email: body.email });
    if (!loginUser) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "User doesn't exist.",
        statusCode: 401,
      });
    }

    const checkPass = await bcrypt.compare(body.password, loginUser.password);

    if (!checkPass) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "Invalid email or password.",
        statusCode: 400,
      });
    }

    if (!loginUser.isVerified) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "Please verify your email.",
        statusCode: 403,
      });
    }

    return new ApiResponse()
      .createJwtToken(loginUser._id.toString())
      .sendResponse({
        success: true,
        message: "Login successful.",
        statusCode: 200,
      });
  } catch (error) {
    console.error(error);
    return new ApiResponse().sendResponse({
      success: false,
      message: "Error during login, please try again.",
      statusCode: 500,
    });
  }
}
