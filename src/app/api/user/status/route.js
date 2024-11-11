import ApiResponse from "@/lib/apiResponse";
import { authMiddleware } from "@/lib/authMiddleware";
import { uploadMedia } from "@/lib/uploadMedia";
import Status from "@/models/status.model";
// create new status
export function POST(req) {
  return authMiddleware(async (req) => {
    const form = await req.formData();
    const type = form.get("type");
    const content = form.get("content");
    const background = form.get("background");
    const owner = req.user._id;
    const file = form.get("file");
    const description = form.get("description");
    const blockViews = form.get("blockViews");
    const caption = form.get("caption");

    if (!type) {
      return new ApiResponse().sendResponse({
        message: "please provide type",
        success: false,
        statusCode: 400,
      });
    }
    if (type === "image" || type === "video") {
      console.log(type);
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        return new ApiResponse().sendResponse({
          message: "file size should be less than 5MB",
          success: false,
          statusCode: 400,
        });
      }
      const result = await uploadMedia(file);
      await Status.create({
        type,
        owner,
        ...(blockViews && { blockViews }),
        ...(result && {
          media: {
            url: result.url,
            publicId: result.public_id,
            ...(description && { description }),
          },
        }),
        caption,
      });
      return new ApiResponse().sendResponse({
        success: true,
        message: "status added successfully",
        statusCode: 200,
      });
    }
    if (!content) {
      return new ApiResponse().sendResponse({
        message: "please provide content",
        success: false,
        statusCode: 400,
      });
    }
    console.log(caption);
    const a = await Status.create({
      type,
      content: {
        text: content,
        background,
      },
      caption: caption,
      owner,
      ...(blockViews && { blockViews }),
    });
    return new ApiResponse().sendResponse({
      success: true,
      message: "status added successfully",
      statusCode: 200,
    });
  }, req);
}

//get all status
export function GET(req) {
  return authMiddleware(async (req) => {
    const friendIds = [...req.user.friends, req.user._id];
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const statuses = await Status.aggregate([
      {
        $match: {
          $and: [
            { owner: { $in: friendIds } },
            { expire: { $gte: oneDayAgo } },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "friendInfo",
        },
      },
      {
        $unwind: "$friendInfo",
      },
      {
        $group: {
          _id: "$owner",
          username: { $first: "$friendInfo.username" },
          profilePic: { $first: "$friendInfo.profilePic" },
          type: { $first: "status" },
          status: {
            $push: {
              content: "$content",
              media: "$media",
              expire: "$expire",
              type: "$type",
              caption: "$caption",
              createdAt: "$createdAt",
              views: "$views",
              _id: "$_id",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          owner: "$_id",
          username: 1,
          profilePic: 1,
          status: 1,
          type: 1,
        },
      },
      {
        $sort: {
          "status.createdAt": -1,
        },
      },
    ]);

    return new ApiResponse().sendResponse({
      success: true,
      message: "Friend statuses fetched successfully",
      statusCode: 200,
      data: statuses,
    });
  }, req);
}
