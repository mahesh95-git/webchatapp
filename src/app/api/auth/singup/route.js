import dbConnect from "@/lib/dbConnection";
import bcrypt from "bcryptjs";
import User from "@/models/user.model";
import signupSchema from "@/zodSchema/signup.Schema";
import apiResponse from "@/lib/apiResponse";
import sendEmail from "@/lib/nodeMailer";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
 
    console.log(body)

    const zodRes = signupSchema.safeParse(body);

    if (!zodRes.success) {
      return new apiResponse().sendResponse({
        success: false,
        message: "Invalid input data.",
        data: zodRes.error,
        statusCode: 400,
      });
    }

    await User.findOne({ email: body.email });
    const {email,username} = zodRes.data

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const verificationToken = jwt.sign(
      { email: email },
      process.env.JWT_PRIVATE_KEY,
      { algorithm: "HS256",
        expiresIn:"5d"
       }
    );
    const newUser = await User.create({
     email,
     username,
      password: hashedPassword,
      verificationToken,
    });
    await sendEmail({
      receiverEmail: newUser.email,
      name: newUser.username,
      url:`${process.env.PROTOCOL}://${process.env.DOMAIN}/verifyemail/${verificationToken}`,
    });

    return new apiResponse().sendResponse({
      success: true,
      message: "User registered successfully. Please verify your email.",
      statusCode: 201,
    });
  } catch (error) {
    console.error(error);
    return new apiResponse().sendResponse({
      success: false,
      message: error?.message || "internal server error",
      statusCode: 500,
    });
  }
}
