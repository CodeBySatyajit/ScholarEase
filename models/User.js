const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { type } = require("node:os");
const Review = require("./review.js");

const registerSchema = new Schema({
  FirstName: {
    type: String,
    required: true,
  },

  LastName: {
    type: String,
    required: true,
  },

  Email: {
    type: String,
    required: true,
    unique: true,
  },

  Mobile: {
    type: Number,
    required: true,
    unique: true,
  },

  Password: {
    type: String,
    required: true,
  },
});

registerSchema.pre("save", async function () {
  if (!this.isModified("Password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
});

const User = mongoose.model("User", registerSchema);

module.exports = User;