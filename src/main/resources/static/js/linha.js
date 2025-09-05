//Cadastra a linha
function cadastrarLinha() {
    const inputCode = document.getElementById("input_code");
    const inputName = document.getElementById("input_name");
    const inputDescription = document.getElementById("input_description");
    const inputColor = document.getElementById("input_color");

    const code = inputCode.value;
    const name = inputName.value;
    const description = inputDescription.value;
    const color = inputColor.value;

    if (!code || !name || !description || !color) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    //Envia para o backend
    fetch("/routes/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name, description, color })
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao cadastrar linha");
            return res.json();
        })
        .then(() => {
            alert("Linha cadastrada com sucesso!");
        })
        .catch(err => {
            console.error(err);
            alert("Erro ao cadastrar linha");
        });

    //Para limpar os campos do formulário
    inputCode.value = "";
    inputName.value = "";
    inputDescription.value = "";
    inputColor.value = "";
}

function setupEvents() {
    document.getElementById("form-route").addEventListener("submit", function (event) {
        event.preventDefault();
        cadastrarLinha();
    });
}

//Configura os eventos ao carregar a página
window.addEventListener("load", setupEvents);