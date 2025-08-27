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

    fetch(`/vehicles/search?prefix=${encodeURIComponent(identifier)}`)
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


//Valida manutenção do veículo com o ChatGPT (apenas 1 por vez)
function chatSelected() {
    const selected = Array.from(document.querySelectorAll("tbody input:checked"))
        .map(cb => cb.value);

    if (selected.length === 0) {
        alert("Selecione pelo menos 1 veículo!");
        return;
    }

    if (selected.length > 1) {
        alert("Selecione somente 1 veículo para validar!");
        return;
    }

    const id = selected[0];

    fetch(`/vehicles/${id}`)
        .then(res => res.json())
        .then(vehicle => {
            //Salva o ID do veículo no campo hidden
            document.getElementById("chat_vehicle_id").value = vehicle.id;

            //Abre o modal de manutenção
            document.getElementById("chatModal").classList.remove("hidden");

            //Sempre reseta o resultado anterior
            document.getElementById("chatResult").innerText = "";
        })
        .catch(err => console.error("Erro ao buscar veículo:", err));
}

//Fecha modal de manutenção
function closeChatModal() {
    document.getElementById("chatModal").classList.add("hidden");
}

//Mostra/esconde os campos conforme o tipo escolhido
function updateChatFields() {
    const type = document.getElementById("chat_type").value;

    //Esconde todos os inputs dinâmicos
    document.querySelectorAll(".chat-fields").forEach(div => div.classList.add("hidden"));
    //Mostra apenas os inputs do select escolhido
    const fields = document.getElementById("fields_" + type);
    if (fields) fields.classList.remove("hidden");
}

//Trás o formulário de manutenção
document.getElementById("form-chat").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("chat_vehicle_id").value;
    const type = document.getElementById("chat_type").value;

    //Primeiro pega o veículo no backend
    fetch(`/vehicles/${id}`)
        .then(res => res.json())
        .then(vehicle => {
            let payload = {
                type,
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                fuelType: vehicle.fuelType
            };

            if (type === "troca_oleo") {
                payload.dataOleo = document.getElementById("input_data_oleo").value;
                payload.kmOleo = document.getElementById("input_km_oleo").value;
                payload.kmAtual = document.getElementById("input_km_atual_oleo").value;
            } else if (type === "pneus") {
                payload.dataPneu = document.getElementById("input_data_pneu").value;
                payload.kmPneu = document.getElementById("input_km_pneu").value;
                payload.kmAtual = document.getElementById("input_km_atual_pneus").value;
            } else if (type === "revisao_geral") {
                payload.dataCompra = document.getElementById("input_data_compra").value;
                payload.kmAtual = document.getElementById("input_km_atual_revisao").value;
            }

            document.getElementById("chatResult").innerText = "⏳ Consultando recomendações...";

            //Faz a chamada pro backend ChatController
            return fetch(`/api/chat/maintenance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Erro no backend: " + res.status);
            }
            return res.text();
        })
        .then(answer => {
            document.getElementById("chatResult").innerText = answer;
        })
        .catch(err => {
            console.error("Erro ao consultar manutenção:", err);
            document.getElementById("chatResult").innerText = "Erro ao consultar manutenção";
        });
});

function menuReturn() {
    window.location.href = "/html/empresa.html";
}