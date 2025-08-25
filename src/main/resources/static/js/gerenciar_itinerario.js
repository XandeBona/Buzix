//Renderiza a tabela
function renderTable(data) {
    const tbody = document.querySelector("#tripsTable tbody");
    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5'>Nenhum itinerário encontrado</td></tr>";
        return;
    }

    data.forEach(trips => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${trips.routeCode} - ${trips.routeName}</td>
        <td>${trips.vehicleRegistrationPlate || "Sem veículo"}</td>
        <td>${trips.departureTime}</td>
        <td>${trips.arrivalTime}</td>
        <td><input type="checkbox" value="${trips.id}"></td>
    `;
        tbody.appendChild(tr);
    });
}

//Lista todos os itinerários
function loadAll() {
    fetch("/trips/all")
        .then(res => res.json())
        .then(data => renderTable(data))
        .catch(err => console.error("Erro ao carregar todos:", err));
}

//Busca itinerário por rota
function searchTrip() {
    const routeName = document.getElementById("searchInput").value.trim();
    if (!routeName) {
        alert("Digite o nome ou código da rota!");
        return;
    }

    fetch(`/trips/search?prefix=${encodeURIComponent(routeName)}`)
        .then(res => res.json())
        .then(data => renderTable(data))
        .catch(err => console.error("Erro na busca:", err));
}

//Exclui itinerários selecionados
function deleteSelected() {
    const selected = Array.from(document.querySelectorAll("tbody input:checked"))
        .map(cb => cb.value);

    if (selected.length === 0) {
        alert("Selecione pelo menos 1 itinerário!");
        return;
    }

    if (!confirm(`Deseja excluir ${selected.length} itinerário(s)?`)) return;

    Promise.all(
        selected.map(id =>
            fetch(`/trips/${id}`, { method: "DELETE" })
        )
    )
        .then(() => {
            alert("Itinerário(s) excluído(s) com sucesso!");
            loadAll();
        })
        .catch(err => console.error("Erro ao excluir:", err));
}

//Edita itinerário selecionado (apenas 1 por vez)
function editSelected() {
    const selected = Array.from(document.querySelectorAll("tbody input:checked"))
        .map(cb => cb.value);

    if (selected.length === 0) {
        alert("Selecione pelo menos 1 itinerário!");
        return;
    }

    if (selected.length > 1) {
        alert("Selecione somente 1 itinerário para editar!");
        return;
    }

    const id = selected[0];

    //Buscar os dados atuais do itinerário
    fetch(`/trips/${id}`)
        .then(res => res.json())
        .then(trips => {
            //Preenche os inputs com os dados atuais
            document.getElementById("input_edit_id").value = trips.id;
            document.getElementById("input_edit_route").value = trips.routeCode + " - " + trips.routeName;
            document.getElementById("input_edit_route_id").value = trips.routeId;
            document.getElementById("input_edit_departureTime").value = trips.departureTime;
            document.getElementById("input_edit_arrivalTime").value = trips.arrivalTime;

            // --- Preencher veículo ---
            if (trips.vehicle) {
                document.getElementById("input_edit_vehicle").value = trips.vehicleRegistrationPlate;
                document.getElementById("input_edit_vehicle").dataset.selectedId = trips.vehicleId;
            }

            //Mostra o modal
            document.getElementById("editModal").classList.remove("hidden");
        })
        .catch(err => console.error("Erro ao buscar itinerário:", err));
}

//Fecha modal sem salvar
function closeModal() {
    document.getElementById("editModal").classList.add("hidden");
}

//Salva a edição do itinerário
document.getElementById("form-edit").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("input_edit_id").value;
    const routeId = document.getElementById("input_edit_route").value;
    const vehicleId = document.getElementById("input_edit_vehicle").dataset.selectedId;
    const departureTime = document.getElementById("input_edit_departureTime").value;
    const arrivalTime = document.getElementById("input_edit_arrivalTime").value;

    if (!routeId || !vehicleId) {
        alert("Selecione a rota e o veículo!");
        return;
    }

    fetch(`/trips/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            routeId: document.getElementById("input_edit_route_id").value,
            vehicleId: vehicleId || null,
            departureTime,
            arrivalTime
        })
    })
        .then(() => {
            alert("Itinerário atualizado com sucesso!");
            closeModal();
            loadAll();
        })
        .catch(err => console.error("Erro ao editar:", err));
});

function menuReturn() {
    window.location.href = "/html/empresa.html"
}

// --- Para o campo input de veículos que possui pesquisa no modal --- //
var vehicles = [];
var vehicleInput = document.getElementById("input_edit_vehicle");
var vehicleList = document.getElementById("vehicle-options");

fetch("/vehicles/all")
  .then(res => res.json())
  .then(data => {
    vehicles = data; showVehicleOptions(vehicles);
  });

function showVehicleOptions(items) {
  vehicleList.innerHTML = "";
  items.forEach(v => {
    var li = document.createElement("li");
    li.textContent = "Placa " + v.registrationPlate;
    li.dataset.id = v.id;
    li.addEventListener("click", function () {
      vehicleInput.value = li.textContent;
      vehicleList.style.display = "none";
      vehicleInput.dataset.selectedId = li.dataset.id;
    });
    vehicleList.appendChild(li);
  });
}

vehicleInput.addEventListener("focus", function () {
  vehicleList.style.display = "block";
});

vehicleInput.addEventListener("input", function () {
  var filter = vehicleInput.value.toLowerCase();
  Array.from(vehicleList.children).forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(filter) ? "block" : "none";
  });
});

document.addEventListener("click", function (e) {
  if (!vehicleInput.contains(e.target) && !vehicleList.contains(e.target)) {
    vehicleList.style.display = "none";
  }
});