//Mostrar menu ao clicar no nome de usuário (quando está logado)
document.getElementById("saudacao").addEventListener("click", function () {
    document.getElementById("card-logout").classList.toggle("hidden");
});

//Botão Editar (futuro redirecionamento)
document.getElementById("btn-editar").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/editar_usuario.html";
});

//Botão Sair
document.getElementById("btn-sair").addEventListener("click", function (e) {
    fetch("/auth/logout", {
        method: "POST",
        credentials: "include"
    }).then(() => {
        window.location.href = "/login.html";
    });
});

function toggleSubmenu(event) {
    event.preventDefault();
    const parent = event.target.closest('.submenu');
    parent.classList.toggle('open');
}

function carregarPagina() {
    const saudacaoDiv = document.getElementById("saudacao");

    fetch("http://localhost:8080/usuarios/me", { credentials: "include" })
        .then(res => {
            if (!res.ok) throw new Error("Não autenticado");
            return res.json();
        })
        .then(user => {
            const primeiroNome = user.userName.split(" ")[0];
            saudacaoDiv.innerText = `Olá, ${primeiroNome}!`;

        });
}


window.addEventListener("load", carregarPagina);