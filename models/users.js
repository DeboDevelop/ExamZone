const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roll_no: {
    type: String,
    required: true,
    default: "",
  },
  course: {
    type: String,
    required: true,
    default: "",
  },
  semester: {
    type: Number,
    required: true,
    default: 0,
  },
  is_examiner: {
    type: Boolean,
    required: true,
    default: true,
  }
});

module.exports = mongoose.model("User", userSchema);
