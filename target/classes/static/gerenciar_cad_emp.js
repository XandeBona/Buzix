function buscarUsuarioPorID(id) {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.log("Usuário não autenticado");
      return;
    }
  
    if (!id) {
      alert("Digite o ID do usuário");
      return;
    }
  
    fetch(`http://localhost:8080/usuarios/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((data) => {
        if (!data.ok) {
          throw new Error("Usuário não encontrado");
        }
        return data.json();
      })
      .then((usuario) => {
        console.log("Usuário encontrado:", usuario);
        document.querySelector("input[name='nome']").value = usuario.nome || "";
        document.querySelector("input[name='email']").value = usuario.email || "";
        document.querySelector("input[name='senha']").value = usuario.senha || "";
        document.querySelector("input[name='confirmar_senha']").value = usuario.senha || "";
      })
      .catch((error) => {
        console.log(error);
        alert("Erro ao buscar usuário: " + error.message);
      });
  }
  
  function editarUsuario() {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.log("Usuário não autenticado");
      return;
    }
  
    const id = document.querySelector("input[name='id']").value.trim();
    const nome = document.querySelector("input[name='nome']").value.trim();
    const email = document.querySelector("input[name='email']").value.trim();
    const senha = document.querySelector("input[name='senha']").value.trim();
    const confirmarSenha = document.querySelector("input[name='confirmar_senha']").value.trim();
  
    if (!id || !nome || !email || !senha || !confirmarSenha) {
      alert("Preencha todos os campos");
      return;
    }
  
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem");
      return;
    }
  
    fetch(`http://localhost:8080/usuarios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ nome, email, senha }),
    })
      .then((data) => {
        if (!data.ok) {
          throw new Error("Erro ao editar usuário");
        }
        return data.json();
      })
      .then((response) => {
        console.log("Usuário editado com sucesso:", response);
        alert("Usuário editado com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        alert("Erro: " + error.message);
      });
  }
  
  function excluirUsuario() {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.log("Usuário não autenticado");
      return;
    }
  
    const id = document.querySelector("input[name='id']").value.trim();
  
    if (!id) {
      alert("Digite o ID do usuário para excluir");
      return;
    }
  
    if (!confirm("Tem certeza que deseja excluir este usuário?")) {
      return;
    }
  
    fetch(`http://localhost:8080/usuarios/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((data) => {
        if (!data.ok) {
          throw new Error("Erro ao excluir usuário");
        }
        alert("Usuário excluído com sucesso!");
        // Limpar os campos
        document.querySelector("form").reset();
      })
      .catch((error) => {
        console.log(error);
        alert("Erro: " + error.message);
      });
  }
  
  function configurarEventosGerenciar() {
    const campoID = document.querySelector("input[name='id']");
    const botaoEditar = document.querySelector("input[value='Editar']");
    const botaoExcluir = document.querySelector("input[value='Excluir']");
  
    campoID.addEventListener("blur", () => {
      buscarUsuarioPorID(campoID.value.trim());
    });
  
    botaoEditar.addEventListener("click", (e) => {
      e.preventDefault();
      editarUsuario();
    });
  
    botaoExcluir.addEventListener("click", (e) => {
      e.preventDefault();
      excluirUsuario();
    });
  }
  
  window.addEventListener("load", configurarEventosGerenciar);
  
