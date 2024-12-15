const Job = require("../Models/Jobs");
const JobApplication = require("../Models/Application");
const path = require("path");

const postJob = async (req, res) => {
  const { jobId, title, description, tags } = req.body;

  try {
    // Check if a job with the same ID already exists
    const existingJob = await Job.findOne({ jobId });
    if (existingJob) {
      return res
        .status(400)
        .json({ message: "A job with this ID already exists" });
    }

    // Create a new job
    const newJob = new Job({
      jobId,
      title,
      description,
      tags,
    });

    // Save the new job to the database
    const savedJob = await newJob.save();

    res.status(201).json(savedJob);
  } catch (error) {
    if (error) {
      res
        .status(500)
        .json({ message: "Error creating job", error: error.message });
    }
  }
};

const getAllJobs = async (req, res) => {
  try {
    // Retrieve all jobs from the database
    const jobs = await Job.find();

    res.status(200).json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving jobs", error: error.message });
  }
};

const searchJobs = async (req, res) => {
  let { jobId, title, description, tags } = req.query;

  jobId = typeof jobId === "string" ? jobId : String(jobId);
  title = typeof title === "string" ? title : String(title);
  description =
    typeof description === "string" ? description : String(description);
  tags = typeof tags === "string" ? tags : String(tags);

  try {
    let jobs = await Job.find({
      $or: [
        { jobId: { $regex: jobId, $options: "i" } },
        { title: { $regex: title, $options: "i" } },
        { description: { $regex: description, $options: "i" } },
        { tags: { $regex: tags, $options: "i" } },
      ],
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postApplication = async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user._id;
  const resume = req.file.path;
  const { coverMessage } = req.body;

  try {
    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({ message: "Job not found" });
    }

    // Create a new job application
    const newApplication = new JobApplication({
      jobId,
      userId,
      resume,
      coverMessage,
    });

    // Save the new job application to the database
    const savedApplication = await newApplication.save();

    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  postJob,
  getAllJobs,
  searchJobs,
  postApplication,
};
