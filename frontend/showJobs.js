document.addEventListener("DOMContentLoaded", async () => {
  // Get token from local storage
  const token = localStorage.getItem("token");
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decodedData = JSON.parse(window.atob(base64));
  const userId = decodedData._id;

  // Get the modal element
  const modal = document.getElementById("apply-modal");

  try {
    // Send token to backend and retrieve all jobs
    const response = await fetch("http://localhost:3000/api/job/getJobs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const jobs = await response.json();

    const jobList = document.getElementById("job-list");
    const applyBtns = [];

    const updateTable = (jobs) => {
      // Clear table
      jobList.innerHTML = "";

      // Update table with filtered jobs
      jobs.forEach((job, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <th scope="row">${index + 1}</th>
          <td>${job._id}</td>
          <td>${job.title}</td>
          <td>${job.description}</td>
          <td>${job.tags}</td>
          <td><button class="btn btn-outline-light apply-btn" data-bs-toggle="modal" data-bs-target="#apply-modal" data-jobid="${
            job._id
          }" data-userid="${userId}">Apply</button></td>
        `;
        jobList.appendChild(tr);

        // Add event listener to apply button in row
        const applyBtn = tr.querySelector(".apply-btn");
        applyBtn.addEventListener("click", () => {
          const jobId = applyBtn.dataset.jobid;
          const userId = applyBtn.dataset.userid;
          const jobInput = document.getElementById("jobid-input");
          const userInput = document.getElementById("userid-input");

          // Prefill Job ID and User ID inputs
          jobInput.value = jobId;
          userInput.value = userId;
        });

        applyBtns.push(applyBtn);
      });
    };

    // Update table with all jobs
    updateTable(jobs);

    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    searchButton.addEventListener("click", async () => {
      const searchTerm = searchInput.value;
      try {
        const response = await fetch(`http://localhost:3000/api/job/searchJobs?title=${searchTerm}&description=${searchTerm}&tags=${searchTerm}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const jobs = await response.json();
        updateTable(jobs);
      } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
      }
    });
    

    // Add event listener to apply button in modal
    const modalApplyBtn = document.getElementById("modal-apply-btn");
    modalApplyBtn.addEventListener("click", async () => {
      const jobId = document.getElementById("jobid-input").value;

      const userId = document.getElementById("userid-input").value;
      const resume = document.getElementById("resume-input").files[0];
      const coverMessage = document.getElementById("cover-input").value;

      // Create form data object
      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("userId", userId);
      formData.append("resume", resume);
      formData.append("coverMessage", coverMessage);

      try {
        // Send form data to backend to apply for job
        const response = await fetch(
          `http://localhost:3000/api/job/apply/` + jobId,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );
        const data = await response.json();

        // If successful, show success message and hide modal
        if (response.status === 201) {
          alert("Successfully applied for job!");
         
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
      }
    });
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again.");
  }
});
