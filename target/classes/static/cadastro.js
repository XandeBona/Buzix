function confereSenha() {
  const inputPassword = document.getElementById("input_password");
  const inputConfirmPassword = document.getElementById("input_confirm_password");

  if (inputConfirmPassword.value !== inputPassword.value) {
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
      window.location.href = "/login.html"; 
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