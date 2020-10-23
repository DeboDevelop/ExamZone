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
    default: "",
  },
  emp_code: {
    type: String,
    default: "",
  },
  course: {
    type: String,
    default: "",
  },
  semester: {
    type: Number,
    default: 0,
  },
  is_examiner: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("User", userSchema);
