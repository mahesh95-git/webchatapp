import ApiResponse from "@/lib/apiResponse";
import { authMiddleware } from "@/lib/authMiddleware";
import Status from "@/models/status.model";
import User from "@/models/user.model";

// get views
export function GET(req, { params }) {
  return authMiddleware(
    async (req, params) => {
      const id = params.id;
      const userId = req.user._id;
      if (!id) {
        return new ApiResponse().sendResponse({
          message: "please provide id",
          success: false,
          statusCode: 400,
        });
      }

      const status = await Status.findOne({
        $and: [
          {
            owner: userId,
          },
          {
            _id: id,
          },
        ],
      });

      const views = await User.aggregate([
        {
          $match: {
            _id: {
              $in: status.views,
            },
          },
        },
        {
          $project: {
            username: 1,
            profilePic: 1,
          },
        },
      ]);
      if (!status) {
        return new ApiResponse().sendResponse({
          message: "not found",
          success: false,
          statusCode: 401,
        });
      }
      return new ApiResponse().sendResponse({
        message: "views fetched successfully",
        success: true,
        statusCode: 201,
        data: views,
      });
    },
    req,
    params
  );
}

// delete status
export function DELETE(req, { params }) {
  return authMiddleware(
    async (req, params) => {
      const id = params.id;
      const userId = req.user._id;
      if (!id) {
        return new ApiResponse().sendResponse({
          message: "please provide id",
          success: false,
          statusCode: 400,
        });
      }

      const status = await Status.deleteOne({
        $and: [
          {
            owner: userId,
          },
          {
            _id: id,
          },
        ],
      });

      if (!status) {
        return new ApiResponse().sendResponse({
          message: "not found",
          success: false,
          statusCode: 401,
        });
      }
      return new ApiResponse().sendResponse({
        message: "status deleted successfully",
        success: true,
        statusCode: 201,
      });
    },
    req,
    params
  );
}
// add view to status
export function PATCH(req, { params }) {
  return authMiddleware(
    async (req, params) => {
      const id = params.id;
      const userId = req.user._id;
      if (!id) {
        return new ApiResponse().sendResponse({
          message: "please provide id",
          success: false,
          statusCode: 400,
        });
      }

      const status = await Status.findOne({
        _id: id,
      });
      if (!status) {
        return new ApiResponse().sendResponse({
          message: "status not found",
          success: false,
          statusCode: 401,
        });
      }
      const owner = await User.findOne({ _id: status.owner });
      const isFriend = owner.friends.some((value) => {
        return value.toString() === userId.toString();
      });

      if (!isFriend) {
        return new ApiResponse().sendResponse({
          message: "you are not friend",
          success: false,
          statusCode: 400,
        });
      }
      const alreadyAdded = status.views?.some(
        (value) => value.toString() == userId.toString()
      );
      if (!alreadyAdded) {
        status.views.push(userId);
        await status.save();
      }

      return new ApiResponse().sendResponse({
        message: "view added successfully",
        success: true,
        statusCode: 201,
      });
    },
    req,
    params
  );
}
