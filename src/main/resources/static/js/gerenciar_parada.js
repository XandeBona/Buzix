//Renderiza a tabela
function renderTable(data) {
    const tbody = document.querySelector("#stoptimesTable tbody");
    tbody.innerHTML = "";

    //Se não houver parada cadastrada
    if (!data || data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6'>Nenhuma parada encontrada</td></tr>";
        return;
    }

    //Cria uma linha na tabela para cada parada
    data.forEach(stop => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${stop.tripRouteName + " | " + stop.tripDepartureTime + " -> " + stop.tripArrivalTime}</td>
        <td>${stop.busStopIdentifier}</td>
        <td>${stop.stopSequence}</td>
        <td>${stop.arrivalTime}</td>
        <td>${stop.departureTime}</td>
        <td><input type="checkbox" value="${stop.id}"></td>
    `;
        tbody.appendChild(tr);
    });
}

//Lista todas as paradas
function loadAll() {
    fetch("/stoptimes/all")
        .then(res => res.json())
        .then(data => renderTable(data))
        .catch(err => console.error("Erro ao carregar todas as paradas:", err));
}

//Busca parada pelo nome do ponto de ônibus
function searchStop() {
    const busstop = document.getElementById("input-search").value.trim();
    if (!busstop) {
        alert("Digite o nome do ponto de ônibus!");
        return;
    }

    fetch(`/stoptimes/search?prefix=${encodeURIComponent(busstop)}`)
        .then(res => res.json())
        .then(data => renderTable(data)) //Mostra os resultados filtrados
        .catch(err => console.error("Erro na busca:", err));
}

//Exclui paradas selecionadas
function deleteSelected() {
    const selected = Array.from(document.querySelectorAll("tbody input:checked"))
        .map(cb => cb.value); //Pega os IDs selecionados

    if (selected.length === 0) {
        alert("Selecione pelo menos 1 parada!");
        return;
    }

    if (!confirm(`Deseja excluir ${selected.length} parada(s)?`)) return;

    //Faz delete em cada parada selecionada
    Promise.all(
        selected.map(id =>
            fetch(`/stoptimes/${id}`, { method: "DELETE" })
        )
    )
        .then(() => {
            alert("Parada(s) excluída(s) com sucesso!");
            loadAll();
        })
        .catch(err => console.error("Erro ao excluir parada(s):", err));
}

//Edita parada selecionada (apenas 1 por vez)
function editSelected() {
    const selected = Array.from(document.querySelectorAll("tbody input:checked"))
        .map(cb => cb.value);

    if (selected.length === 0) {
        alert("Selecione pelo menos 1 parada!");
        return;
    }

    if (selected.length > 1) {
        alert("Selecione somente 1 parada para editar!");
        return;
    }

    const id = selected[0];

    //Busca os dados atuais da parada
    fetch(`/stoptimes/${id}`)
        .then(res => res.json())
        .then(stop => {
            //Preenche os inputs com os dados atuais
            document.getElementById("input_edit_id").value = stop.id;
            document.getElementById("input_edit_trip").value = stop.tripRouteName + " | " + stop.tripDepartureTime + " -> " + stop.tripArrivalTime;
            document.getElementById("input_edit_trip_id").value = stop.tripId;
            document.getElementById("input_edit_busstop").value = stop.busStopIdentifier;
            document.getElementById("input_edit_busstop_id").value = stop.busStopId;
            document.getElementById("input_edit_stopSequence").value = stop.stopSequence;
            document.getElementById("input_edit_arrivalTime").value = stop.arrivalTime;
            document.getElementById("input_edit_departureTime").value = stop.departureTime;

            //Mostra o modal
            document.getElementById("editModal").classList.remove("hidden");
        })
        .catch(err => console.error("Erro ao buscar parada:", err));
}

//Fecha modal sem salvar
function closeModal() {
    document.getElementById("editModal").classList.add("hidden");
}

//Salva a edição da parada
document.getElementById("form-edit").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("input_edit_id").value;
    const tripId = document.getElementById("input_edit_trip_id").value;
    const busStopId = document.getElementById("input_edit_busstop_id").value;
    const stopSequence = document.getElementById("input_edit_stopSequence").value;
    const arrivalTime = document.getElementById("input_edit_arrivalTime").value;
    const departureTime = document.getElementById("input_edit_departureTime").value;

    if (!tripId || !busStopId) {
        alert("Itinerário e ponto de ônibus são obrigatórios!");
        return;
    }
    
    //Envia os dados atualizados para o backend
    fetch(`/stoptimes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            tripId,
            busStopId,
            stopSequence,
            arrivalTime,
            departureTime
        })
    })
        .then(() => {
            alert("Parada atualizada com sucesso!");
            closeModal();
            loadAll();
        })
        .catch(err => console.error("Erro ao editar parada:", err));
});

//Botão para voltar ao menu da empresa
function menuReturn() {
    window.location.href = "/html/empresa.html";
}