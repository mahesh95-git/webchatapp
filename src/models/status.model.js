import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  blockViews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  type: {
    type: String,
    enum: ["text", "image", "video"],
    default: "text",
  },
  content: {
    text: String,
    background: String,
  },
  media: {
    url: {
      type: String,
    },
    publicId: {
      type: String,
    },
    description: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  caption:{
    type:String
  },

  expire: {
    type: Date,
    default: function () {
      return Date.now() + 24 * 60 * 60 * 1000;
    },
  },
});

const Status = mongoose.models.Status || mongoose.model("Status", statusSchema);

export default Status;
