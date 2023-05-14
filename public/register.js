const errorMsg = document.getElementById("errorMsg");
const submitBtn = document.getElementById("submit-register");
const URL = "http://localhost:9979";

submitBtn.addEventListener("click", (e) => {
  register();
});

function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  console.log(username + email + password);

  const data = { username, email, password };

  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status == 422) {
        errorMsg.innerText = "This user already exist";
      } else if (response.status != 200) {
        errorMsg.innerText = "Unexpected error";
      }
      return response.json();
    })
    .catch((err) => console.error("Error: ", err));
}
