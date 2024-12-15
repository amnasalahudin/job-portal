document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login");
  loginBtn.addEventListener("click", loginUser);
});

function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === "" || password === "") {
    alert("Enter all fields!");
    return;
  }

  fetch("http://localhost:3000/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        // user is logged in, save token to localStorage or cookie
        localStorage.setItem("token", data.token);
        console.log(data.token);
        document.querySelector("form").reset();
        console.log(data.user.role);
        alert("Logged in successfully");
        if (data.user.role === "student") {
          window.location.href = "showJobs.html";
        }
        if (data.user.role === "employee") {
          window.location.href = "addJob.html";
        }
      } else {
        alert(data.message);
      }
    })
    .catch((err) => {
      console.error(err);
      alert("An error occurred while logging in. Please try again later.");
    });
}

document.getElementById("login").addEventListener("click", loginUser);
