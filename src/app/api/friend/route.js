import apiResponse from "@/lib/apiResponse";
import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnection";
export async function GET(req){
    const body=req.json();
    const username=body.username;
    if(!username){
        return  new apiResponse().sendResponse({success:false,message:"provide valid information",statusCode:403});
    }
    try {
       await dbConnect();
       const userFriends=await User.aggregate([{
        $match:{
            username:username
        },
    $graphLookup,
    $lookup:{
        foreignField:"User",
        localField:"friends",
        
    }

       }])
        
    } catch (error) {
        
    }


}