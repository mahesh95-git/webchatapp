import ApiResponse from "@/lib/apiResponse";
import { authMiddleware } from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnection";
import { uploadMedia } from "@/lib/uploadMedia";
import Chat from "@/models/chat.model";
import Group from "@/models/group.model";
import Media from "@/models/media.model";
import mongoose from "mongoose";

// remove member
export async function PATCH(req, { params }) {
  return await authMiddleware(async (req) => {
    const id = params.id;
    const adminId = req.user._id;
    const body = await req.json();
    const userId = body.userId;
    if (!userId && !id) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "userId and id are required",
        statusCode: 401,
      });
    }
    const group = await Group.findById(id);
    if (!group) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "group not exit",
        statusCode: 401,
      });
    }

    if (!group.members.includes(userId)) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "you are not member of this group",
        statusCode: 400,
      });
    }

    if (!group.admin.includes(adminId)) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "you are not admin of this group",
        statusCode: 400,
      });
    }

    let members = group.members.filter((m) => m.toString() != userId);
    group.members = members;
    await group.save();
    return new ApiResponse().sendResponse({
      success: true,
      message: "user removed from group",
      statusCode: 200,
    });
  }, req);
}

// add member to group
export async function PUT(req, { params }) {
  return await authMiddleware(async (req) => {
    const id = params.id;
    const adminId = req.user._id;
    const body = await req.json();
    const { newMembers } = body;
    if (!newMembers.length || !id) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "new members and group id are required",
        statusCode: 401,
      });
    }
    const group = await Group.findById(id);
    if (!group) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "group not exit",
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

    const alreadyMembers = group.members.filter((m) =>
      newMembers.includes(m.toString())
    );
    if (alreadyMembers.length > 0) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "user already added to group",
        statusCode: 400,
      });
    }

    const members = [...group.members, ...newMembers];
    group.members = members;
    await group.save();

    return new ApiResponse().sendResponse({
      success: true,
      message: "user added to group",
      statusCode: 200,
    });
  }, req);
}

// update group
export async function POST(req, { params }) {
  try {
    return await authMiddleware(async (req) => {
      await dbConnect();
      const id = params.id;
      const adminId = req.user._id;
      const formData = await req.formData();
      const name = formData.get("name");
      const about = formData.get("about");
      if (!id) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "id is required",
          statusCode: 401,
        });
      }
      const profilePic = formData.get("profilePic");
      let newProfile;

      const group = await Group.findOne({
        _id: id,
      });
      if (!group) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "group not exit",
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
      if (profilePic!="null") {
        newProfile =await uploadMedia(profilePic);
      }
      group.name = name;
      group.about = about;
      if (newProfile) {
        group.profilePic = {
          url: newProfile.url,
          public_id: newProfile.public_id,
        };
      }
     const data = await group.save({
        new: true,});
      return new ApiResponse().sendResponse({
        success: true,
        message: "group updated successfully",
        statusCode: 200,
        data:{
          name:data.name,
          about:data.about,
          profilePic:data.profilePic
        }
      });
    }, req);
  } catch (error) {}
}

// get group info
export async function GET(req, { params }) {
  try {
    return await authMiddleware(async (req) => {
      await dbConnect();
      const id = params.id;
      const userId = req.user._id;
      const group = await Group.findById(id);
      if (!group) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "group not exit",
          statusCode: 401,
        });
      }

      if (!group.members.includes(userId)) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "you are not member of this group",
          statusCode: 400,
        });
      }

      const groupInfo = await Group.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $unwind: "$members",
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
            members: {
              _id: 1,
              username: 1,
              profilePic: 1,
            },
            totalMembers: { $size: "$members" },
          },
        },
      ]);

      return new ApiResponse().sendResponse({
        success: true,
        message: "group fetched successfully",
        data: groupInfo,
        statusCode: 200,
      });
    }, req);
  } catch (error) {
    return new ApiResponse().sendResponse({
      success: false,
      message: error,
      statusCode: 500,
    });
  }
}

// delete group
export async function DELETE(req, { params }) {
  try {
    return await authMiddleware(async (req) => {
      await dbConnect();
      const id = params.id;
      const userId = req.user._id;
      const group = await Group.findById(id);
      if (!group) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "group not exit",
          statusCode: 401,
        });
      }

      if (!group.admin.includes(userId)) {
        return new ApiResponse().sendResponse({
          success: false,
          message: "you are not admin of this group",
          statusCode: 400,
        });
      }
      const promise = [
        Group.deleteOne({ _id: id }),
        Chat.deleteMany({ groupId: id }),
        Media.deleteMany({ groupId: id }),
      ];
      await Promise.all(promise);

      return new ApiResponse().sendResponse({
        success: true,
        message: "group is successfully deleted",
        statusCode: 201,
      });
    }, req);
  } catch (error) {
    return new ApiResponse().sendResponse({
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
}
