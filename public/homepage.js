const URL = "http://localhost:9979";
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");

function logout() {
  fetch(`${URL}/logout`, {
    method: "get",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

fetchData();

function fetchData() {
  fetch(`${URL}/getData`)
    .then((res) => res.json())
    .then((res) => {
      nameField.innerText = res.name;
      emailField.innerText = res.email;
    })
    .catch((err) => console.error(err));
}
