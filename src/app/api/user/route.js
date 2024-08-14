import ApiResponse from "@/lib/apiResponse";
import dbConnect from "@/lib/dbConnection";
import User from "@/models/user.model";

// delete account
export async function DELETE(req) {
    try {
        const userId = "66b7761e584864ad7bf02321";
        await dbConnect();

        const user = await User.findById(userId);
        if (!user) {
            return new ApiResponse().sendResponse({
                success: false,
                message: "user not found",
                statusCode: 400,
            });
        }
        await user.remove();
        return new ApiResponse().sendResponse({
            success: true,
            message: "account deleted successfully",
            statusCode: 200,
        })
    } catch (error) {
        return new ApiResponse().sendResponse({
            success: false,
            message: error,
            statusCode: 500,
        });
    }
}
// get profile
export async function GET(req) {
    try {
        const userId = "66b7761e584864ad7bf02321";

        await dbConnect();

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return new ApiResponse().sendResponse({
                success: false,
                message: "user not found",
                statusCode: 400,
            });
        }
    }catch (error) {
        return new ApiResponse().sendResponse({
            success: false,
            message: error,
            statusCode: 500,
        });
    }
}

// update profile
export async function PUT(req) {
    try {

        //TODO:: add image
        const userId = "66b7761e584864ad7bf02321";

        await dbConnect();

        const user = await User.findById(userId);
        if (!user) {
            return new ApiResponse().sendResponse({
                success: false,
                message: "user not found",
                statusCode: 400,    
            });
        }

        const body = await req.json();

        user.name = body.name;
        user.about = body.about;
        user.email=body.email;

        await user.save();

        return new ApiResponse().sendResponse({
            success: true,
            message: "profile updated successfully",
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

