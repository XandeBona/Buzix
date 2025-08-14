function validarDadosLogin() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa estar logado para cadastrar um ponto!");
        window.location.href = "login.html";
        return;
    }

    fetch("http://localhost:8080/usuarios/me", {
        headers: { Authorization: "Bearer " + token }
    })
        .then(res => {
            if (!res.ok) throw new Error("Token inválido ou expirado");
            return res.json();
        })
        .then(() => {
            cadastrarPonto(token);
        })
        .catch(() => {
            localStorage.removeItem("token");
            alert("Sessão expirada, faça login novamente.");
            window.location.href = "login.html";
        });
}

function cadastrarPonto(token) {
    const inputIdentifier = document.getElementById("input_identifier");
    const inputLatitude = document.getElementById("input_latitude");
    const inputLongitude = document.getElementById("input_longitude");

    const identifier = inputIdentifier.value;
    const latitude = inputLatitude.value;
    const longitude = inputLongitude.value;

    if (!identifier || isNaN(latitude) || isNaN(longitude)) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    fetch("http://localhost:8080/busstops/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            identifier,
            latitude,
            longitude
        })
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao cadastrar ponto");
            return res.json();
        })
        .then(() => {
            alert("Ponto cadastrado com sucesso!");
            window.location.href = "index.html";
        })
        .catch(err => {
            console.error(err);
            alert("Erro ao cadastrar ponto");
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
