function carregarLinha() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.log("Usuário não autenticado");
        return;
    }

    const id = document.getElementById("numero").value;

    if (!id) {
        console.log("Informe o ID da linha");
        return;
    }

    fetch(`http://localhost:8080/linhas/${id}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    })
        .then(data => data.json())
        .then(response => {
            console.log(response);
            document.getElementById("nome").value = response.nome || "";
            document.getElementById("inicio").value = response.inicio || "";
            document.getElementById("fim").value = response.fim || "";
            document.getElementById("horaInicio").value = response.horaInicio || "";
            document.getElementById("horaFim").value = response.horaFim || "";
            document.getElementById("dias").value = response.dias || "";
            document.getElementById("intervalo").value = response.intervalo || "";
        })
        .catch(error => {
            console.log(error);
            localStorage.removeItem("token");
        });
}

function editarLinha() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.log("Usuário não autenticado");
        return;
    }

    const id = document.getElementById("numero").value;
    const dados = {
        nome: document.getElementById("nome").value,
        inicio: document.getElementById("inicio").value,
        fim: document.getElementById("fim").value,
        horaInicio: document.getElementById("horaInicio").value,
        horaFim: document.getElementById("horaFim").value,
        dias: document.getElementById("dias").value,
        intervalo: document.getElementById("intervalo").value
    };

    fetch(`http://localhost:8080/linhas/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        body: JSON.stringify(dados)
    })
        .then(data => data.json())
        .then(response => {
            console.log(response);
            alert("Linha atualizada com sucesso!");
        })
        .catch(error => {
            console.log(error);
            alert("Erro ao atualizar a linha");
        });
}

function excluirLinha() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.log("Usuário não autenticado");
        return;
    }

    const id = document.getElementById("numero").value;

    fetch(`http://localhost:8080/linhas/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + token
        }
    })
        .then(() => {
            alert("Linha excluída com sucesso!");
            document.getElementById("formLinha").reset();
        })
        .catch(error => {
            console.log(error);
            alert("Erro ao excluir a linha");
        });
}

function configurarEventos() {
    document.querySelector("input[value='Editar']").addEventListener("click", (e) => {
        e.preventDefault();
        editarLinha();
    });

    document.querySelector("input[value='Excluir']").addEventListener("click", (e) => {
        e.preventDefault();
        excluirLinha();
    });

    // Se quiser carregar automaticamente ao digitar ID
    document.getElementById("numero").addEventListener("blur", carregarLinha);
}

window.addEventListener("load", configurarEventos);
