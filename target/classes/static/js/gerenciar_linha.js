//Renderiza a tabela
function renderTable(data) {
    const tbody = document.querySelector("#routesTable tbody");
    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5'>Nenhuma linha encontrada</td></tr>";
        return;
    }

    data.forEach(routes => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
    <td>${routes.code}</td>
    <td>${routes.name}</td>
    <td>${routes.description}</td>
    <td>${routes.color}</td>
    <td><input type="checkbox" value="${routes.id}"></td>
    `;
        tbody.appendChild(tr);
    });
}

//Lista todas as linhas
function loadAll() {
    fetch("/routes/all")
        .then(res => res.json())
        .then(data => renderTable(data))
        .catch(err => console.error("Erro ao carregar todos:", err));
}

//Busca pelo nome da linha
function searchRoutes() {
    const name = document.getElementById("searchInput").value.trim();
    if (!name) {
        alert("Digite o nome da linha!");
        return;
    }

    fetch(`/routes/search?prefix=${encodeURIComponent(name)}`)
        .then(res => res.json())
        .then(data => renderTable(data))
        .catch(err => console.error("Erro na busca:", err));
}

//Exclui as linhas selecionadas
function deleteSelected() {
    const selected = Array.from(document.querySelectorAll("tbody input:checked"))
        .map(cb => cb.value);

    if (selected.length === 0) {
        alert("Selecione pelo menos 1 linha!");
        return;
    }

    if (!confirm(`Deseja excluir ${selected.length} linhas(s)?`)) return;

    Promise.all(
        selected.map(id =>
            fetch(`/routes/${id}`, { method: "DELETE" })
        )
    )
        .then(() => {
            alert("Linha(s) excluída(s) com sucesso!");
            loadAll();
        })
        .catch(err => console.error("Erro ao excluir:", err));
}

//Edita a linha selecionada (apenas 1 por vez)
function editSelected() {
    const selected = Array.from(document.querySelectorAll("tbody input:checked"))
        .map(cb => cb.value);

    if (selected.length === 0) {
        alert("Selecione pelo menos 1 linha!");
        return;
    }

    if (selected.length > 1) {
        alert("Selecione somente 1 linha para editar!");
        return;
    }

    const id = selected[0];

    //Busca os dados atuais da linha
    fetch(`/routes/${id}`)
        .then(res => res.json())
        .then(routes => {
            //Preenche os inputs com os dados atuais
            document.getElementById("input_edit_id").value = routes.id;
            document.getElementById("input_edit_code").value = routes.code;
            document.getElementById("input_edit_name").value = routes.name;
            document.getElementById("input_edit_description").value = routes.description;
            document.getElementById("input_edit_color").value = routes.color;

            //Mostra o modal
            document.getElementById("editModal").classList.remove("hidden");
        })
        .catch(err => console.error("Erro ao buscar linha:", err));
}

//Fecha modal sem salvar - se clicar em "Cancelar"
function closeModal() {
    document.getElementById("editModal").classList.add("hidden");
}

//Salva a edição do ponto
document.getElementById("form-edit").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("input_edit_id").value;
    const code = document.getElementById("input_edit_code").value;
    const name = document.getElementById("input_edit_name").value;
    const description = document.getElementById("input_edit_description").value;
    const color = document.getElementById("input_edit_color").value;

    fetch(`/routes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name, description, color })
    })
        .then(() => {
            alert("Linha atualizada com sucesso!");
            closeModal();
            loadAll();
        })
        .catch(err => console.error("Erro ao editar:", err));
});

function menuReturn() {
    window.location.href = "/html/empresa.html"
}