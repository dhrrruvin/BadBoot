const URL = "http://localhost:9979";

function redirectToRegister() {
  location.href = `${URL}/register`;
}

function redirectToHome() {}

const errorMsg = document.getElementById("errorMsg");

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = { email, password };

  fetch(`${URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status == 404) {
        errorMsg.innerText = "This user does not exist!";
        setTimeout(() => {
          redirectToRegister();
        }, 3000);
      } else if (response.status == 401) {
        errorMsg.innerText = "password is incorrect, try again!";
      } else if (response.status == 200) {
        location.href = `${URL}/home`;
      } else {
        errorMsg.innerText = "Unexpected error";
      }
    })
    .catch((err) => console.error("Error: ", err));
}
