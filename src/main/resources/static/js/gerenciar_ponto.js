//Renderiza a tabela
function renderTable(data) {
  const tbody = document.querySelector("#busStopsTable tbody");
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = "<tr><td colspan='4'>Nenhum ponto encontrado</td></tr>";
    return;
  }

  data.forEach(busStop => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
  <td>${busStop.identifier}</td>
  <td>${busStop.latitude}</td>
  <td>${busStop.longitude}</td>
  <td><input type="checkbox" value="${busStop.id}"></td>
  `;
    tbody.appendChild(tr);
  });
}

//Lista todos os pontos
function loadAll() {
  fetch("/busstops/all")
    .then(res => res.json())
    .then(data => renderTable(data))
    .catch(err => console.error("Erro ao carregar todos:", err));
}

//Busca pelo nome do ponto
function searchBusStop() {
  const identifier = document.getElementById("searchInput").value.trim();
  if (!identifier) {
    alert("Digite o nome do ponto!");
    return;
  }

  fetch(`/busstops/search?prefix=${encodeURIComponent(identifier)}`)
    .then(res => res.json())
    .then(data => renderTable(data))
    .catch(err => console.error("Erro na busca:", err));
}

//Exclui os pontos selecionados
function deleteSelected() {
  const selected = Array.from(document.querySelectorAll("tbody input:checked"))
    .map(cb => cb.value);

  if (selected.length === 0) {
    alert("Selecione pelo menos 1 ponto!");
    return;
  }

  if (!confirm(`Deseja excluir ${selected.length} ponto(s)?`)) return;

  Promise.all(
    selected.map(id =>
      fetch(`/busstops/${id}`, { method: "DELETE" })
    )
  )
    .then(() => {
      alert("Ponto(s) excluído(s) com sucesso!");
      loadAll();
    })
    .catch(err => console.error("Erro ao excluir:", err));
}

//Edita o ponto selecionado (apenas 1 por vez)
function editSelected() {
  const selected = Array.from(document.querySelectorAll("tbody input:checked"))
    .map(cb => cb.value);

  if (selected.length === 0) {
    alert("Selecione pelo menos 1 ponto!");
    return;
  }

  if (selected.length > 1) {
    alert("Selecione somente 1 ponto para editar!");
    return;
  }

  const id = selected[0];

  //Buscar os dados atuais do ponto
  fetch(`/busstops/${id}`)
    .then(res => res.json())
    .then(busStop => {
      //Preenche os inputs com os dados atuais
      document.getElementById("input_edit_id").value = busStop.id;
      document.getElementById("input_edit_identifier").value = busStop.identifier;
      document.getElementById("input_edit_latitude").value = busStop.latitude;
      document.getElementById("input_edit_longitude").value = busStop.longitude;

      //Mostra o modal
      document.getElementById("editModal").classList.remove("hidden");
    })
    .catch(err => console.error("Erro ao buscar ponto:", err));
}

//Fecha modal sem salvar - se clicar em "Cancelar"
function closeModal() {
  document.getElementById("editModal").classList.add("hidden");
}

//Salva a edição do ponto
document.getElementById("form-edit").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("input_edit_id").value;
  const identifier = document.getElementById("input_edit_identifier").value;
  const latitude = document.getElementById("input_edit_latitude").value;
  const longitude = document.getElementById("input_edit_longitude").value;

  fetch(`/busstops/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, latitude, longitude })
  })
    .then(() => {
      alert("Ponto atualizado com sucesso!");
      closeModal();
      loadAll();
    })
    .catch(err => console.error("Erro ao editar:", err));
});

function menuReturn() {
  window.location.href = "empresa.html"
}