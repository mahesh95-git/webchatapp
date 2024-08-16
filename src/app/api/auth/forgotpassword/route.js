import ApiResponse from "@/lib/apiResponse";
import dbConnect from "@/lib/dbConnection";
import User from "@/models/user.model";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "user not found",
        statusCode: 400,
      });
    }
    const token = new ApiResponse().createJwtToken(user._id);
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    await sendEmail({
      receiverEmail: email,
      name: user.name,
      url: `${process.env.PROTOCOL}://${process.env.DOMAIN}/forgotpassword/${token}`,
      subject: "password reset link",
      emailFormate: forgotPasswordEmailFormate,
    });
    return new ApiResponse().sendResponse({
      success: true,
      message: "password reset link sent to your email",
      statusCode: 200,
    });
  } catch (error) {
    console.log(error.message);
    return new ApiResponse().sendResponse({
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
}
