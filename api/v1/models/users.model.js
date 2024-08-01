const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true,
  });
const User = mongoose.model('User', userSchema, "users"); //users là tên connection trong database

module.exports = User; 