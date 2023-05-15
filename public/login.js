const errorMsg = document.getElementById("errorMsg");
const submitBtn = document.getElementById("submit-login");
const URL = "http://localhost:9979";

submitBtn.addEventListener("click", (e) => {
  login();
});

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  console.log(email + password);

  const data = { email, password };

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status == 404) {
        errorMsg.innerText = "This user does not exist!";
      } else if (response.status == 401) {
        errorMsg.innerText = "password is incorrect, try again!";
      } else if (response.status != 200) {
        errorMsg.innerText = "Unexpected error";
      }
      console.log("redirecting to protected");
    })
    .catch((err) => console.error("Error: ", err));
}
