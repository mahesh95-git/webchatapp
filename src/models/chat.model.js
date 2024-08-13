import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
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
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default Chat;
