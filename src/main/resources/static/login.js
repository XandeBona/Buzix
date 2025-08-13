function validarDadosLogin() {
    const inputEmail = document.getElementById("input_email");
    const inputPassword = document.getElementById("input_password");

    const email = inputEmail.value;
    const password = inputPassword.value;

    if (!email || !password) {
        alert("Digite o email e a senha");
        return;

    }
    realizarLogin(email, password);
}

function realizarLogin(email, password) {
    fetch("http://localhost:8080/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
    })
        .then((data) => data.json())
        .then((response) => {
            console.log(response);
            localStorage.setItem("token", response.token);
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.log(error);
            alert("Usuario ou senha incorretos");
        });
}

function setupEvents() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        validarDadosLogin();
    });
}

window.addEventListener("load", setupEvents);