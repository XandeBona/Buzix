// script_ponto.js

// Carrega um ponto pelo ID digitado
function carregarPonto() {
    const id = document.getElementById("idPonto").value.trim();
    if (!id) return;

    const ponto = JSON.parse(localStorage.getItem(`ponto_${id}`));
    if (ponto) {
        document.getElementById("identificacao").value = ponto.identificacao;
        document.getElementById("latitude").value = ponto.latitude;
        document.getElementById("longitude").value = ponto.longitude;
    } else {
        alert("Ponto não encontrado!");
    }
}

// Salva/edita um ponto no localStorage
function editarPonto(event) {
    event.preventDefault();

    const id = document.getElementById("idPonto").value.trim();
    const identificacao = document.getElementById("identificacao").value.trim();
    const latitude = document.getElementById("latitude").value.trim();
    const longitude = document.getElementById("longitude").value.trim();

    if (!id || !identificacao || !latitude || !longitude) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    const ponto = { identificacao, latitude, longitude };
    localStorage.setItem(`ponto_${id}`, JSON.stringify(ponto));

    alert("Ponto salvo/atualizado com sucesso!");
}

// Exclui um ponto do localStorage
function excluirPonto(event) {
    event.preventDefault();

    const id = document.getElementById("idPonto").value.trim();
    if (!id) {
        alert("Digite o ID do ponto para excluir.");
        return;
    }

    if (localStorage.getItem(`ponto_${id}`)) {
        localStorage.removeItem(`ponto_${id}`);
        alert("Ponto excluído com sucesso!");

        document.getElementById("formPonto").reset();
    } else {
        alert("Ponto não encontrado!");
    }
}

// Adiciona os eventos aos botões
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("formPonto").addEventListener("submit", editarPonto);
    document.getElementById("btnExcluir").addEventListener("click", excluirPonto);
});
