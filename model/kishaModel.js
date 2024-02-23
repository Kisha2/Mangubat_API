const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "The course code must be filled in."],
  },
  description: {
    type: String,
    required: [true, "The course description must be filled in."],
  },
  units: {
    type: Number,
    required: [true, "The units must be filled in."],
  },
  tags: {
    type: [String],
    required: [true, "Tags field must be filled in."],
  },
});

const yearSchema = new mongoose.Schema(
  {
    "1st Year": [courseSchema],
    "2nd Year": [courseSchema],
    "3rd Year": [courseSchema],
    "4th Year": [courseSchema],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", yearSchema);

module.exports = Course;