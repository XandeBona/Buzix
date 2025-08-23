function cadastrarPonto() {
    const inputIdentifier = document.getElementById("input_identifier");
    const inputLatitude = document.getElementById("input_latitude");
    const inputLongitude = document.getElementById("input_longitude");

    const identifier = inputIdentifier.value;
    const latitude = inputLatitude.value;
    const longitude = inputLongitude.value;

    if (!identifier || isNaN(latitude) || isNaN(longitude)) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    fetch("/busstops/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, latitude, longitude })
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao cadastrar ponto");
            return res.json();
        })
        .then(() => {
            alert("Ponto cadastrado com sucesso!");
        })
        .catch(err => {
            console.error(err);
            alert("Erro ao cadastrar ponto");
        });

    //Para limpar os campos do formulário
    inputIdentifier.value = "";
    inputLatitude.value = "";
    inputLongitude.value = "";
}

function setupEvents() {
    document.getElementById("form-busStop").addEventListener("submit", function (event) {
        event.preventDefault();
        cadastrarPonto();
    });
}

window.addEventListener("load", setupEvents);