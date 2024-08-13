import mongoose from "mongoose";
const mediaSchema = mongoose.Schema({
  group: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  },
  sender: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  receiver: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  isGroup: {
    type: Boolean,
    default: false,
  },

  source: {
    url: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },

  type: {
    type: String,
    enum: ["image", "video", "audio", "document"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Media = mongoose.models.Media || mongoose.model("Media", mediaSchema);

export default Media;
