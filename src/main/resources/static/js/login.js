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
    fetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    })
        .then(res => {
            if (!res.ok) throw new Error("Usuário ou senha incorretos");
            return res.json();
        })
        .then(() => {
            window.location.href = "/index.html";
        })
        .catch(error => {
            console.log(error);
            alert("Usuário ou senha incorretos");
        });
}

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    const isPassword = input.type === "password";
  
    input.type = isPassword ? "text" : "password";
  
    icon.classList.toggle('fa-eye', !isPassword);
    icon.classList.toggle('fa-eye-slash', isPassword);
  }

function setupEvents() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        validarDadosLogin();
    });
}

window.addEventListener("load", setupEvents);