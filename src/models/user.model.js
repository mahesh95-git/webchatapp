import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  profilePic: {
   url: {
    type: String,
   },
   publicId: {
    type: String,
   }
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  friendRequests: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  lastSeen: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  about: {
    type: String,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpires: {
    type: Date,
    default: function () {
      return Date.now() + 24 * 60 * 60 * 1000; // Default to 24 hours from now
    },
  },
  resetToken: {
    type: String,
  },
  resetTokenExpires: {
    type: Date,
    default: function () {
      return Date.now() + 24 * 60 * 60 * 1000;
    },
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
