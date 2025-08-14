function toggleSubmenu(event) {
    event.preventDefault();
    const parent = event.target.closest('.submenu');
    parent.classList.toggle('open');
}

function carregarPagina() {
    console.log("URL atual:", window.location.href);
    console.log("Token salvo:", localStorage.getItem("token"));
    console.log("Role salva:", localStorage.getItem("role"));
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    console.log("Token:", token);
    console.log("Role:", `"${role}"`);

    if (!token || role.trim().toUpperCase() !== "ROLE_ADMIN") {
        alert("Acesso negado!");
        window.location.href = "index.html";
    }
}


window.addEventListener("load", carregarPagina);