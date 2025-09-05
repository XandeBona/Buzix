//Valida os campos do Login
function validarDadosLogin() {
    const inputEmail = document.getElementById("input_email");
    const inputPassword = document.getElementById("input_password");

    const email = inputEmail.value;
    const password = inputPassword.value;

    if (!email || !password) {
        alert("Digite o email e a senha");
        return;
    }

    //Chama a função para realizar o login
    realizarLogin(email, password);
}

//Envia para o backend e loga o usuário se estiver correto
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
            //Envia o usuário para a página do mapa se o login funcionar
            window.location.href = "/index.html";
        })
        .catch(error => {
            console.log(error);
            alert("Usuário ou senha incorretos");
        });
}

//Exibe/oculta a senha ao clicar no ícone do olho
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    const isPassword = input.type === "password";

    //Muda o tipo do input entre "password" e "text"
    input.type = isPassword ? "text" : "password";

    icon.classList.toggle('fa-eye', !isPassword);
    icon.classList.toggle('fa-eye-slash', isPassword);
}

//Configura o evento de submit do formulário
function setupEvents() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        validarDadosLogin();
    });
}

//Configura os eventos ao carregar a página
window.addEventListener("load", setupEvents);