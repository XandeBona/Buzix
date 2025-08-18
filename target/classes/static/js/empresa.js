function toggleSubmenu(event) {
    event.preventDefault();
    const parent = event.target.closest('.submenu');
    parent.classList.toggle('open');
}

function carregarPagina() {
    fetch("/usuarios/me", { credentials: "include" })
        .then(res => {
            if (!res.ok) {
                alert("Acesso negado!");
                window.location.href = "index.html";
            }
            return res.json();
        })
        .catch(err => {
            console.log("Erro ao verificar usuário:", err);
            alert("Acesso negado!");
            window.location.href = "index.html";
        });
}


window.addEventListener("load", carregarPagina);