import mongoose from "mongoose";
const mediaSchema = mongoose.Schema({
    
    url: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    message:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    groupMessage:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "GroupChat"

    }

})

const Media =mongoose.models.Media|| mongoose.model("Media", mediaSchema);  

export default Media