function carregarItinerario() {
    const token = localStorage.getItem("token");
    const id = document.getElementById("id").value.trim();
  
    if (!token) {
      console.log("Usuário não autenticado");
      return;
    }
  
    if (!id) {
      alert("Digite o ID do itinerário");
      return;
    }
  
    fetch(`http://localhost:8080/itinerarios/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((data) => {
        if (!data.ok) {
          throw new Error("Itinerário não encontrado");
        }
        return data.json();
      })
      .then((itinerario) => {
        console.log("Itinerário carregado:", itinerario);
        document.getElementById("ponto").value = itinerario.ponto || "";
        if (itinerario.horarios && itinerario.horarios.length > 0) {
          document.getElementById("horario").value = itinerario.horarios[0];
        }
        renderizarHorarios(itinerario.horarios || []);
      })
      .catch((error) => {
        console.error(error);
        alert("Erro ao carregar itinerário: " + error.message);
      });
  }
  
  function editarItinerario() {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.log("Usuário não autenticado");
      return;
    }
  
    const id = document.getElementById("id").value.trim();
    const ponto = document.getElementById("ponto").value.trim();
    const horario = document.getElementById("horario").value.trim();
  
    if (!id || !ponto) {
      alert("Preencha o ID e o nome do ponto");
      return;
    }
  
    fetch(`http://localhost:8080/itinerarios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ ponto, horarios: [horario] }),
    })
      .then((data) => {
        if (!data.ok) {
          throw new Error("Erro ao editar itinerário");
        }
        return data.json();
      })
      .then((response) => {
        console.log("Itinerário editado com sucesso:", response);
        alert("Itinerário editado com sucesso!");
      })
      .catch((error) => {
        console.error(error);
        alert("Erro: " + error.message);
      });
  }
  
  function excluirItinerario() {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.log("Usuário não autenticado");
      return;
    }
  
    const id = document.getElementById("id").value.trim();
  
    if (!id) {
      alert("Digite o ID do itinerário para excluir");
      return;
    }
  
    if (!confirm("Tem certeza que deseja excluir este itinerário?")) {
      return;
    }
  
    fetch(`http://localhost:8080/itinerarios/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((data) => {
        if (!data.ok) {
          throw new Error("Erro ao excluir itinerário");
        }
        alert("Itinerário excluído com sucesso!");
        document.getElementById("formItinerario").reset();
        renderizarHorarios([]);
      })
      .catch((error) => {
        console.error(error);
        alert("Erro: " + error.message);
      });
  }
  
  function renderizarHorarios(horarios) {
    const tbody = document.querySelector("#tabelaHorarios tbody");
    tbody.innerHTML = "";
  
    horarios.forEach((hora, index) => {
      const tr = document.createElement("tr");
  
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${hora}</td>
        <td>
          <button onclick="removerHorario(${index})">Remover</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  function removerHorario(index) {
    const horarios = Array.from(document.querySelectorAll("#tabelaHorarios tbody tr td:nth-child(2)"))
      .map(td => td.textContent);
    horarios.splice(index, 1);
    renderizarHorarios(horarios);
  }
  
  function configurarEventosItinerario() {
    const botoes = document.querySelectorAll("#formItinerario input[type='submit']");
    
    botoes[0].addEventListener("click", (e) => {
      e.preventDefault();
      editarItinerario();
    });
  
    botoes[1].addEventListener("click", (e) => {
      e.preventDefault();
      excluirItinerario();
    });
  }
  
  window.addEventListener("load", configurarEventosItinerario);
  