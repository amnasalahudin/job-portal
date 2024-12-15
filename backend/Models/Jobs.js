const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
