<<<<<<< HEAD
function editarPonto() {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.log("Ponto não cadastrado");
      return;
    }
  
    fetch("http://localhost:8080/usuarios", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((data) => data.json())
      .then((response) => {
        console.log(response);
        const lista = document.getElementById("usuarios");
        for (let usuario of response) {
          const li = document.createElement("li");
          li.innerText = usuario.email;
          lista.appendChild(li);
        }
      })
      .catch((error) => {
        console.log(error);
        localStorage.removeItem("token");
      });
  }
  
  function realizarLogin() {
    const inputEmail = document.getElementById("input_email");
    const inputPassword = document.getElementById("input_password");
  
    const email = inputEmail.value;
    const password = inputPassword.value;
  
    console.log(email, password);
  
    if (!email || !password) {
      alert("Digite o email e a senha");
      return;
    }
  
    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.token);
        carregarUsuarios();
      })
      .catch((error) => {
        console.log(error);
        alert("Id ou identificação do incorretos");
      });
  }
  
  function configurarEventos() {
    const botaoLogar = document.getElementById("botao_entrar");
    botaoLogar.addEventListener("click", realizarLogin);
  
    carregarUsuarios();
  }
  
  window.addEventListener("load", configurarEventos);
=======
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
>>>>>>> 695e171e0ff5b845d088413c4107bc9544ec2781
