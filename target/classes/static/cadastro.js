function cadastrarUsuario() {
   // const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    //const confirmarSenha = document.getElementById("confirmar_senha").value.trim();
    // Validação dos dados 
    if (!email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem.");
        return;
    }


    // Cria um objeto com os dados do usuário
    const usuario = {
        //nome: nome,
        email: email,
        senha: senha
    };
    // Envia os dados para o backend
    fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                alert("Usuário cadastrado com sucesso!");
               // document.getElementById("nome").value = "";
                document.getElementById("email").value = "";
                document.getElementById("senha").value = "";
               // document.getElementById("confirmar_senha").value = "";
            } else {
                alert("Erro: " + data.mensagem);
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Erro ao cadastrar usuário.");
        });
}