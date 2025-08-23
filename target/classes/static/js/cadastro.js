function validarSenha(senha) {
  if (!senha) return false;
  if (senha.length < 8) return false;
  if (!/[A-Z]/.test(senha)) return false;        //Valida se tem letra maiúscula
  if (!/[a-z]/.test(senha)) return false;        //Valida se tem letra minúscula
  if (!/\d/.test(senha)) return false;           //Valida se tem número
  if (!/[^a-zA-Z0-9]/.test(senha)) return false; //Valida se tem caractere especial
  return true;
}

function confereSenha() {
  const inputPassword = document.getElementById("input_password");
  const inputConfirmPassword = document.getElementById("input_confirm_password");
  const senha = inputPassword.value;
  const confirmaSenha = inputConfirmPassword.value;

  if (!validarSenha(senha)) {
    alert("Senha inválida! A senha precisa ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial.");
    return;
  }

  if (confirmaSenha !== senha) {
    alert("As senhas não conferem!");
    return;
  }

  registrarUsuario();
}

function registrarUsuario() {
  const userName = document.getElementById("input_user_name").value;
  const email = document.getElementById("input_email").value;
  const password = document.getElementById("input_password").value;

  if (!userName || !email || !password) {
    alert("Preencha todos os campos");
    return;
  }

  fetch("http://localhost:8080/auth/register", {
    method: "POST",
    body: JSON.stringify({ userName, email, password }),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro no registro");
      return res.json();
    })
    .then(response => {
      window.location.href = "/html/login.html"; 
    })
    .catch(err => {
      alert("Erro ao registrar usuário");
      console.error(err);
    });
}

function setupEvents() {
  const form = document.querySelector('form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    confereSenha();
  });
}

window.addEventListener("load", setupEvents);
