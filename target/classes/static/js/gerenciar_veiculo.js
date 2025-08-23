//Renderiza a tabela
function renderTable(data) {
    const tbody = document.querySelector("#vehiclesTable tbody");
    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='8'>Nenhum veículo encontrado</td></tr>";
        return;
    }

    data.forEach(vehicle => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
  <td>${vehicle.identifier}</td>
  <td>${vehicle.registrationPlate}</td>
  <td>${vehicle.make}</td>
  <td>${vehicle.model}</td>
  <td>${vehicle.year}</td>
  <td>${vehicle.numberOfSeats}</td>
  <td>${vehicle.fuelType}</td>
  <td><input type="checkbox" value="${vehicle.id}"></td>
  `;
        tbody.appendChild(tr);
    });
}

//Lista todos os veículos
function loadAll() {
    fetch("/vehicles/all")
        .then(res => res.json())
        .then(data => renderTable(data))
        .catch(err => console.error("Erro ao carregar todos:", err));
}

//Busca pela identificação do veículo
function searchVehicle() {
    const identifier = document.getElementById("input-search").value.trim();
    if (!identifier) {
        alert("Digite o nome do veículo!");
        return;
    }

    fetch(`/vehicle/search?prefix=${encodeURIComponent(identifier)}`)
        .then(res => res.json())
        .then(data => renderTable(data))
        .catch(err => console.error("Erro na busca:", err));
}

//Exclui os veículos selecionados
function deleteSelected() {
    const selected = Array.from(document.querySelectorAll("tbody input:checked"))
        .map(cb => cb.value);

    if (selected.length === 0) {
        alert("Selecione pelo menos 1 veículo!");
        return;
    }

    if (!confirm(`Deseja excluir ${selected.length} veículo(s)?`)) return;

    Promise.all(
        selected.map(id =>
            fetch(`/vehicles/${id}`, { method: "DELETE" })
        )
    )
        .then(() => {
            alert("Veículo(s) excluído(s) com sucesso!");
            loadAll();
        })
        .catch(err => console.error("Erro ao excluir:", err));
}

//Edita o veículo selecionado (apenas 1 por vez)
function editSelected() {
    const selected = Array.from(document.querySelectorAll("tbody input:checked"))
        .map(cb => cb.value);

    if (selected.length === 0) {
        alert("Selecione pelo menos 1 veículo!");
        return;
    }

    if (selected.length > 1) {
        alert("Selecione somente 1 veículo para editar!");
        return;
    }

    const id = selected[0];

    //Buscar os dados atuais do veículo
    fetch(`/vehicles/${id}`)
        .then(res => res.json())
        .then(vehicle => {
            //Preenche os inputs com os dados atuais
            document.getElementById("input_edit_id").value = vehicle.id;
            document.getElementById("input_edit_identifier").value = vehicle.identifier;
            document.getElementById("input_edit_registrationPlate").value = vehicle.registrationPlate;
            document.getElementById("input_edit_make").value = vehicle.make;
            document.getElementById("input_edit_model").value = vehicle.model;
            document.getElementById("input_edit_year").value = vehicle.year;
            document.getElementById("input_edit_numberOfSeats").value = vehicle.numberOfSeats;
            document.getElementById("input_edit_fuelType").value = vehicle.fuelType;

            //Mostra o modal
            document.getElementById("editModal").classList.remove("hidden");
        })
        .catch(err => console.error("Erro ao buscar veículo:", err));
}

//Fecha modal sem salvar - se clicar em "Cancelar"
function closeModal() {
    document.getElementById("editModal").classList.add("hidden");
}

//Salva a edição do veículo
document.getElementById("form-edit").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("input_edit_id").value;
    const identifier = document.getElementById("input_edit_identifier").value;
    const registrationPlate = document.getElementById("input_edit_registrationPlate").value;
    const make = document.getElementById("input_edit_make").value;
    const model = document.getElementById("input_edit_model").value;
    const year = document.getElementById("input_edit_year").value;
    const numberOfSeats = document.getElementById("input_edit_numberOfSeats").value;
    const fuelType = document.getElementById("input_edit_fuelType").value;

    fetch(`/vehicles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, registrationPlate, make, model, year, numberOfSeats, fuelType })
    })
        .then(() => {
            alert("Veículo atualizado com sucesso!");
            closeModal();
            loadAll();
        })
        .catch(err => console.error("Erro ao editar:", err));
});

function menuReturn() {
    window.location.href = "/html/empresa.html"
}