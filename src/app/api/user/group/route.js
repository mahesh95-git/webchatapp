import ApiResponse from "@/lib/apiResponse";
import { authMiddleware } from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnection";
import { uploadMedia } from "@/lib/uploadMedia";
import Group from "@/models/group.model";
import mongoose from "mongoose";

// create group
export async function POST(req) {
  return await authMiddleware(async (req) => {
    const fromData = await req.formData();
    const name = fromData.get("name");
    const about = fromData.get("about");
    const members = fromData.get("members");
    const file = fromData.get("file");
    const userId = req.user._id;

    if (JSON.parse(members).length < 2) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "Group should have at least 3 members",
        statusCode: 400,
      });
    }
    let result;
    if (file) {
      result = await uploadMedia(file);
    }
    const group = [...JSON.parse(members), userId];
    await Group.create({
      ...(result && {
        profilePic: {
          url: result.url,
          public_id: result.public_id,
        },
      }),
      name,
      about,
      admin: userId,
      members: group,
    });
    return new ApiResponse().sendResponse({
      success: true,
      message: "Group created successfully",
      statusCode: 200,
    });
  }, req);
}

// get groups
export async function GET(req) {
  try {
    return await authMiddleware(async (req) => {
      const userId = req.user._id;

      await dbConnect();
      const groups = await Group.aggregate([
        {
          $match: {
            $expr: {
              $in: [new mongoose.Types.ObjectId(userId), "$members"],
            },
          },
        },
        {
          $addFields: {
            type: "group",
          },
        },
        {
          $project: {
            name: 1,
            _id: 1,
            profilePic: 1,
            type: 1,
            totalMembers: { $size: "$members" },
          },
        },
      ]);
      return new ApiResponse().sendResponse({
        success: true,
        message: "Groups fetched successfully",
        data: groups,
        statusCode: 200,
      });
    }, req);
  } catch (error) {
    return new ApiResponse().sendResponse({
      success: false,
      message: error.message || "Server error",
      statusCode: 500,
    });
  }
}

// add new admin to group
export async function PUT(req) {
  return await authMiddleware(async (req) => {
    const adminId = req.user._id;
    const body = await req.json();
    const { userId, groupId } = body;
    if (!userId && !id) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "userId and groupId are required",
        statusCode: 401,
      });
    }
    const group = await Group.findById(groupId);
    if (!group) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "Group not found",
        statusCode: 401,
      });
    }

    if (!group.admin.includes(adminId)) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "you are not admin of this group",
        statusCode: 400,
      });
    }

    if (!group.members.includes(userId)) {
      return new ApiResponse().sendResponse({
        success: false,
        message: " user is not member of this group",
        statusCode: 400,
      });
    }
    if (group.admin.includes(userId)) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "user is already admin",
        statusCode: 400,
      });
    }

    group.admin.push(userId);
    await group.save();
    return new ApiResponse().sendResponse({
      success: true,
      message: "Admin added successfully",
      statusCode: 200,
    });
  }, req);
}

// remove admin from group
export async function DELETE(req) {
  return await authMiddleware(async (req) => {
    const adminId = req.user._id;
    const body = await req.json();
    const { userId, groupId } = body;
    if (!userId && !id) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "userId and groupId are required",
        statusCode: 401,
      });
    }
    const group = await Group.findById(groupId);
    if (!group) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "Group not found",
        statusCode: 401,
      });
    }

    if (!group.admin.includes(adminId)) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "you are not admin of this group",
        statusCode: 400,
      });
    }

    if (!group.members.includes(userId)) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "user is not member of this group",
        statusCode: 400,
      });
    }
    if (!group.admin.includes(userId)) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "user is not admin",
        statusCode: 400,
      });
    }

    group.admin = group.admin.filter((m) => m.toString() !== userId.toString());
    await group.save();
    return new ApiResponse().sendResponse({
      success: true,
      message: "Admin removed successfully",
      statusCode: 200,
    });
  }, req);
}

// leave group
export async function PATCH(req) {
  return await authMiddleware(async (req) => {
    const userId = req.user._id;
    const body = await req.json();
    const { groupId } = body;
    if (!groupId) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "groupId is required",
        statusCode: 401,
      });
    }
    const group = await Group.findById(groupId);
    if (!group) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "Group not found",
        statusCode: 401,
      });
    }

    if (!group.members.includes(userId)) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "user is not member of this group",
        statusCode: 400,
      });
    }

    group.members = group.members.filter(
      (m) => m.toString() !== userId.toString()
    );
    group.admin = group.admin.filter(
      (m) => m.toString() !== userId.toString()
    )
    await group.save();
    return new ApiResponse().sendResponse({
      success: true,
      message: "leaved group successfully",
      statusCode: 200,
    });
  }, req);
}
