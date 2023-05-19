const errorMsg = document.getElementById("errorMsg");
const URL = "http://localhost:9979";

function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = { username, email, password };

  fetch(`${URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status == 403) {
        errorMsg.innerText = "This user already exist";
      } else if (response.status != 200) {
        errorMsg.innerText = "Unexpected error";

        setTimeout(() => {
          location.reload();
        }, 3000);
      } else if (response.status == 200) {
        location.href = `${URL}/login`;
      }
      return response.json();
    })
    .catch((err) => console.error("Error: ", err));
}
