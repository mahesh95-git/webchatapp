import mongoose from "mongoose";
const groupSchema = mongoose.Schema({
  profilePic: {
    url: {
      type: String,
    },
    publicId: {
      type: String,
    },
  },
  name: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  about: {
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
    required: true,
  },
  admin: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    required: true,
  },
});

const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);

export default Group;
