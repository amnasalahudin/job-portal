const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  postJob,
  getAllJobs,
  searchJobs,
  postApplication,
} = require("../Controller/JobController");
const authMiddleware = require("../Middleware/Auth");
const path = require("path");

// Set up multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public/resume");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("File type not supported"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

//post a new job
router.post("/postJob", authMiddleware(["employee"]), postJob);

//get all jobs
router.get("/getJobs", authMiddleware(["student"]), getAllJobs);

router.get("/searchJobs", authMiddleware(["student"]), searchJobs);

router.post(
  "/apply/:id",
  authMiddleware(["student"]),
  upload.single("resume"),
  postApplication
);

module.exports = router;
