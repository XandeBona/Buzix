//Renderiza a tabela de itinerários
function renderTable(data) {
    const tbody = document.querySelector("#tripsTable tbody");
    tbody.innerHTML = "";

    //Se não houver nenhum cadastrado
    if (!data || data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5'>Nenhum itinerário encontrado</td></tr>";
        return;
    }

    //Cria linhas na tabela para cada itinerário
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

//Busca itinerário pelo nome da rota
function searchTrip() {
    const routeName = document.getElementById("input-search").value.trim();
    if (!routeName) {
        alert("Digite o nome ou código da rota!");
        return;
    }

    fetch(`/trips/search?prefix=${encodeURIComponent(routeName)}`)
        .then(res => res.json())
        .then(data => renderTable(data)) //Renderiza os dados na tabela
        .catch(err => console.error("Erro na busca:", err));
}

//Exclui itinerários selecionados
function deleteSelected() {
    const selected = Array.from(document.querySelectorAll("tbody input:checked"))
        .map(cb => cb.value); //Pega os IDs selecionados

    if (selected.length === 0) {
        alert("Selecione pelo menos 1 itinerário!");
        return;
    }

    if (!confirm(`Deseja excluir ${selected.length} itinerário(s)?`)) return;

    //Envia requisição delete para todos os selecionados
    Promise.all(
        selected.map(id =>
            fetch(`/trips/${id}`, { method: "DELETE" })
        )
    )
        .then(() => {
            alert("Itinerário(s) excluído(s) com sucesso!");
            loadAll(); //Recarrega a tabela
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

            //Se tiver o veículo associado
            if (trips.vehicle) {
                document.getElementById("input_edit_vehicle").value = trips.vehicleRegistrationPlate;
                document.getElementById("input_edit_vehicle").dataset.selectedId = trips.vehicleId;
            }

            //Mostra o modal
            document.getElementById("editModal").classList.remove("hidden");
        })
        .catch(err => console.error("Erro ao buscar itinerário:", err));
}

//Fecha modal de edição sem salvar
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

    //Envia os dados atualizados para o backend
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
            closeModal(); //Fecha o modal
            loadAll(); //Recarrega a tabela
        })
        .catch(err => console.error("Erro ao editar:", err));
});

//Botão para retornar ao menu de empresa
function menuReturn() {
    window.location.href = "/html/empresa.html"
}

// --- Para o campo input de veículos que possui pesquisa no modal --- //
var vehicles = [];
var vehicleInput = document.getElementById("input_edit_vehicle");
var vehicleList = document.getElementById("vehicle-options");

//Puxa os veículos do backend
fetch("/vehicles/all")
  .then(res => res.json())
  .then(data => {
    vehicles = data; showVehicleOptions(vehicles);
  });

  //Renderiza as opções de veículos na lista
function showVehicleOptions(items) {
  vehicleList.innerHTML = "";
  items.forEach(v => {
    var li = document.createElement("li");
    li.textContent = "Placa " + v.registrationPlate;
    li.dataset.id = v.id;

    //Ao clicar em uma opção vai definir o valor do input
    li.addEventListener("click", function () {
      vehicleInput.value = li.textContent;
      vehicleList.style.display = "none";
      vehicleInput.dataset.selectedId = li.dataset.id;
    });
    vehicleList.appendChild(li);
  });
}

//Mostra a lista de veículos
vehicleInput.addEventListener("focus", function () {
  vehicleList.style.display = "block";
});

//Filtra opções conforme o usuário digita
vehicleInput.addEventListener("input", function () {
  var filter = vehicleInput.value.toLowerCase();
  Array.from(vehicleList.children).forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(filter) ? "block" : "none";
  });
});

//Fecha a lista se clicar fora do input
document.addEventListener("click", function (e) {
  if (!vehicleInput.contains(e.target) && !vehicleList.contains(e.target)) {
    vehicleList.style.display = "none";
  }
});