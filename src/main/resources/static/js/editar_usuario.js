function validarSenha(senha) {
    if (!senha) return false;
    if (senha.length < 8) return false;
    if (!/[A-Z]/.test(senha)) return false;
    if (!/[a-z]/.test(senha)) return false;
    if (!/\d/.test(senha)) return false;
    if (!/[^a-zA-Z0-9]/.test(senha)) return false;
    return true;
}

function forcarLogout() {
    fetch("/auth/logout", {
        method: "POST",
        credentials: "include"
    })
        .finally(() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/html/login.html";
        });
}

function atualizarUsuario() {
    const name = document.getElementById("input_name").value.trim();
    const email = document.getElementById("input_email").value.trim();
    const currentPassword = document.getElementById("input_current_password").value;
    const newPassword = document.getElementById("input_new_password").value;
    const confirmPassword = document.getElementById("input_confirm_password").value;

    if (!name || !email || !currentPassword) {
        alert("Preencha nome, e-mail e senha atual.");
        return;
    }

    //Se nova senha for fornecida, validar
    if (newPassword || confirmPassword) {
        if (!validarSenha(newPassword)) {
            alert("A nova senha precisa ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("As novas senhas não conferem.");
            return;
        }
    }

    //Carrega o e-mail atual do usuário
    fetch("/usuarios/me", { credentials: "include" })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao obter dados do usuário.");
            return res.json();
        })
        .then(usuarioAtual => {
            const emailAntigo = usuarioAtual.email;

            //Se o usuário colocou um novo e-mail, valida se já está em uso
            if (email !== emailAntigo) {
                return fetch(`/auth/check-email?email=${encodeURIComponent(email)}`, { credentials: "include" })
                    .then(res => {
                        if (!res.ok) throw new Error("Erro ao verificar e-mail.");
                        return res.json();
                    })
                    .then(existe => {
                        if (existe) {
                            alert("Esse e-mail já está em uso.");
                            throw new Error("E-mail duplicado.");
                        }
                        return true;
                    });
            }

            return true;
        })
        .then(() => {
            const body = {
                userName: name,
                email: email,
                currentPassword: currentPassword,
                newPassword: newPassword || null
            };

            return fetch("/usuarios/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(body)
            });
        })
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    throw new Error(text || "Erro ao atualizar dados.");
                });
            }
            return res.text();
        })
        .then(message => {
            alert(message || "Dados atualizados com sucesso! Faça login novamente.");
            forcarLogout(); //Força logout
        })
        .catch(error => {
            console.error(error);
            if (error.message !== "E-mail duplicado.") {
                alert(error.message || "Erro inesperado.");
            }
        });
}

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    const isPassword = input.type === "password";

    input.type = isPassword ? "text" : "password";

    icon.classList.toggle('fa-eye', !isPassword);
    icon.classList.toggle('fa-eye-slash', isPassword);
}

function setupEvents() {
    const form = document.querySelector("form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        atualizarUsuario();
    });
}

window.addEventListener("load", setupEvents);