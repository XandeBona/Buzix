//Mostra/esconde o menu ao clicar no nome de usuário (quando está logado)
document.getElementById("saudacao").addEventListener("click", function () {
    document.getElementById("card-logout").classList.toggle("hidden");
});

//Botão para editar o perfil do usuário
document.getElementById("btn-editar").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/html/editar_usuario.html";
});

//Botão para logout do usuário
document.getElementById("btn-sair").addEventListener("click", function (e) {
    fetch("/auth/logout", {
        method: "POST",
        credentials: "include"
    }).then(() => {
        window.location.href = "/html/login.html";
    });
});

//Abre e fecha o menu de usuário
function toggleSubmenu(event) {
    event.preventDefault();
    const parent = event.target.closest('.submenu');
    parent.classList.toggle('open');
}

//Chamada ao carregar a página / mostra o nome do usuário logado
function carregarPagina() {
    const saudacaoDiv = document.getElementById("saudacao");

    //Busca as informações do usuário no backend
    fetch("/usuarios/me", { credentials: "include" })
        .then(res => {
            if (!res.ok) throw new Error("Não autenticado");
            return res.json();
        })
        .then(user => {
            //Usa só o primeiro nome do usuário
            const primeiroNome = user.userName.split(" ")[0];
            saudacaoDiv.innerText = `Olá, ${primeiroNome}!`;

        });
}

//Configura os eventos do formulário ao carregar a página
window.addEventListener("load", carregarPagina);