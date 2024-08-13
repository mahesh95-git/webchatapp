import ApiResponse from "@/lib/apiResponse";
import dbConnect from "@/lib/dbConnection";
import Group from "@/models/group.model";
import mongoose from "mongoose";

// create group
export async function POST(req) {
  try {
    await dbConnect();
    const admin = "66b7761e584864ad7bf02321";
    const body = await req.json();
    const { members, name, about } = body;

    //TODO:: add image
    console.log(members, name, about);
    if (members < 2) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "Group should have atleast 3 members",
        statusCode: 400,
      });
    }
    const group =[...members, admin]
      await Group.create({ name, about, admin, members:group });
    return new ApiResponse().sendResponse({
      success: true,
      message: "Group created successfully",
      statusCode: 200,
    });
  } catch (error) {
    return new ApiResponse().sendResponse({
      success: false,
      message: error,
      statusCode: 500,
    });
  }
}

// get groups
export async function GET(req) {
  try {
    const userId = "66ba0319e07ea85d2b057a75";
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
        $project: {
          name: 1,
          _id: 1,
          avatar: 1,
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
  } catch (error) {
    console.log(error);
    return new ApiResponse().sendResponse({
      success: false,
      message: error,
      statusCode: 500,
    });
  }
}
