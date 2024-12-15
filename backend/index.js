const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./Routes/User");
const jobRoutes = require("./Routes/Job");
const authMiddleware = require("./Middleware/Auth");

const app = express();
const cors = require("cors");

app.use(bodyParser.json());


app.use(cors());

mongoose
  .connect(
    "",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: false }));
app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
