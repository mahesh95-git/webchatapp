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
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});