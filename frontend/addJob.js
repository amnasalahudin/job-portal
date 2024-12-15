document.addEventListener("DOMContentLoaded", () => {
  const jobbtn = document.getElementById("job-btn");
  jobbtn.addEventListener("click", createJob);
});

const createJob = async () => {
  const jobId = document.getElementById("jobId").value;
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const tags = document.getElementById("tags").value;

  // Get token from local storage
  const token = localStorage.getItem("token");

  // Send form data and token to backend
  fetch("http://localhost:3000/api/job/postJob", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      jobId,
      title,
      description,
      tags,
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Job Posted successfully");
        document.querySelector("form").reset();
        window.location.href = "login.html";
      }
      if (response.status === 401) {
        alert("Please fill all the fields");
      }
      if (response.status === 402) {
        document.getElementById("jobID").value = "";
        alert("Job with this ID already exists!");
      }
    })
    .catch((error) => {
      console.log(error);
      alert("Error");
    });
};

const jobbtn = document.getElementById("job-btn");
jobbtn.addEventListener("click", createJob);
