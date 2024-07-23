import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    media:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media"
    }
});

const Chat =mongoose.models.Chat|| mongoose.model("Chat", chatSchema);