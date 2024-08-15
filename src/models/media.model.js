import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  source: {
    url: {
      type: String,
      required: true, // It's generally a good idea to require a URL if this is necessary for the media object.
    },
    public_id: {
      type: String,
      required: true, // Similarly, requiring a public_id might be crucial depending on your use case.
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
