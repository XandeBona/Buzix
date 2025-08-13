function validarDadosLogin() {
    const inputEmail = document.getElementById("input_email");
    const inputPassword = document.getElementById("input_password");

    const email = inputEmail.value;
    const password = inputPassword.value;

    console.log(email, password);

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
        .then((res) => {
            if (!res.ok) throw new Error("Erro no login");
            return res.json();
        })
        .then((response) => {
            localStorage.setItem("token", response.token);
            window.location.href = "/index.html";
        })
        .catch(() => alert("Usuário ou senha incorretos"));
}

function setupEvents() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        validarDadosLogin();
    });
}

window.addEventListener("load", setupEvents);