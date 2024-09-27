import { authMiddleware } from "@/lib/authMiddleware";
import User from "@/models/user.model";
import Group from "@/models/group.model";
import ApiResponse from "@/lib/apiResponse";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  return await authMiddleware(
    async (req, params) => {
      const { searchParams } = new URL(req.url);
      const type = searchParams.get("type");
      let info;
      if (type === "group") {
        const id = params.id;
        const group = await Group.findById(id);
        if (!group) {
          return new ApiResponse().sendResponse({
            success: false,
            message: "group not exit",
            statusCode: 401,
          });
        }

        if (!group.members.includes(req.user._id)) {
          return new ApiResponse().sendResponse({
            success: false,
            message: "you are not member of this group",
            statusCode: 400,
          });
        }

        info = await Group.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(id),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "members",
              foreignField: "_id",
              as: "members",
            },
          },
          {
            $project: {
              name: 1,
              about: 1,
              admin: 1,
              profilePic: 1,
              members: {
                _id: 1,
                username: 1,
                profilePic: 1,
                email: 1,
              },
              totalMembers: { $size: "$members" },
            },
          },
        ]);
        if (info.length === 0) {
          return new ApiResponse().sendResponse({
            success: false,
            message: "Group data not found",
            statusCode: 404,
          });
        }
        info = info[0]; // Extract the first result from the array
      } else {
        const id = params.id;
        const user = await User.findById(id).select(
          "-password -friends -friendRequests -lastSeen -verificationToken -verificationTokenExpires -resetToken -resetTokenExpires -isVerified  -__v"
        );
        if (!user) {
          return new ApiResponse().sendResponse({
            success: false,
            message: "user not exit",
            statusCode: 401,
          });
        }
        info = user;
      }
      return new ApiResponse().sendResponse({
        success: true,
        message: "group fetched successfully",
        data: info,
        statusCode: 200,
      });
    },
    req,
    params
  );
}
