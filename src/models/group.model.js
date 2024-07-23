import mongoose from "mongoose";
const groupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    members: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    messages: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "chat",
            },
        ],
    },
    about:{
        type: String

    },
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Group =mongoose.models.Group|| mongoose.model("Group", groupSchema);

export default Group