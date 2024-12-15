document.addEventListener("DOMContentLoaded", () => {
  const registerBTN = document.getElementById("register");
  registerBTN.addEventListener("click", registerUser);
});

function registerUser(event) {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  const contact = document.getElementById("contact").value;

  fetch("http://localhost:3000/api/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role, contact }),
  })
    .then((response) => {
      if (response.ok) {
        alert("User registered successfully");
        document.querySelector("form").reset();
        window.location.href = "login.html";
      }
      if (response.status === 401) {
        alert("Please fill all the fields");
      }
      if (response.status === 402) {
        document.getElementById("email").value = "";
        alert("Email already exists. Please enter a new one");
      }
    })
    .catch((error) => {
      console.log(error);
      alert("Error ");
    });
}

const registerBTN = document.getElementById("register");
registerBTN.addEventListener("click", registerUser);
