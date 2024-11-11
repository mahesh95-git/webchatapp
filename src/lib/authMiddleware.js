import dbConnect from "./dbConnection";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import ApiResponse from "./apiResponse";
export async function authMiddleware(handler,req,params) {
    try {
   
      await dbConnect();
      const token = req.cookies.get("token");
      
      if (!token) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "Unauthorized",
          statusCode: 401,
        });
      }
     
  
      const decoded = jwt.verify(token.value, process.env.JWT_PRIVATE_KEY);
    
      if (!decoded) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "Unauthorized",
          statusCode: 401,
        });
      }
  
      const user = await User.findOne({ _id: decoded.id });
   
      if (!user) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "Unauthorized",
          statusCode: 401,
        });
      }
      req.user = user;
      return await handler(req,params);
    } catch (error) {
      console.log(error);
      return new ApiResponse().sendResponse({
        success: false,
        message: "internal server error",
        statusCode: 500,
      });
    }
  }
  