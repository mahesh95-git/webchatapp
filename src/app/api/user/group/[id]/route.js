import ApiResponse from "@/lib/apiResponse";
import dbConnect from "@/lib/dbConnection";
import Group from "@/models/group.model";
import User from "@/models/user.model";

// remove member
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const id = params.id;
    const adminId = "66b7761e584864ad7bf02321";
    const body = await req.json();
    const { userId } = body;
    if (!userId || !id) {
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

    if (group.admin.toString() !== adminId) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "you are not admin of this group",
        statusCode: 400,
      });
    }
    await Group.updateOne(
      {
        _id: id,
      },
      { $pull: { members: userId } }
    );
    return new ApiResponse().sendResponse({
      success: true,
      message: "user removed from group",
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

// add member to group
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const id = params.id;
    const adminId = "66b7761e584864ad7bf02321";
    const body = await req.json();
    const { userId } = body;
    if (!userId || !id) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "userId and id are required",
        statusCode: 401,
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "user not exit",
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

    await Group.updateOne(
      {
        _id: id,
      },
      { $push: { members: userId } }
    );
    return new ApiResponse().sendResponse({
      success: true,
      message: "user added to group",
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

// update group
export async function POST(req, { params }) {
  try {
    await dbConnect();
    const id = params.id;

   // TODO::add image update
    const body = await req.json();
    const { name, about } = body;
    const group = await Group.findOneUpdate(
      {
        _id: id,
      },
      {
        name,
        about,
      }
    );
    if (!group) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "group not exit",
        statusCode: 401,
      });
    }

    return new ApiResponse().sendResponse({
      success: true,
      message: "group updated successfully",
      statusCode: 200,
    });
  } catch (error) {}
}

// get group info
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const id = params.id;
    const userId = "66ba0319e07ea85d2b057a75";
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

    return new ApiResponse().sendResponse({
      success: true,
      message: "group fetched successfully",
      data: group,
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

// delete group
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const id = params.id;
    const userId = "66ba0319e07ea85d2b057a75";
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
    if (group.admin.toString() !== userId) {
      return new ApiResponse().sendResponse({
        success: false,
        message: "you are not admin of this group",
        statusCode: 400,
      });
    }
    await group.deleteOne();

    return new ApiResponse().sendResponse({
      success: true,
      message: "group is successfully deleted",
      statusCode: 201,
    });
  } catch (error) {
    console.log(error);
    return new ApiResponse().sendResponse({
      success: false,
      message: error.message,
      statusCode: 500,
    });
  }
}
