function cadastrarVeiculo() {
    const inputIdentifier = document.getElementById("input_identifier");
    const inputPlate = document.getElementById("input_registrationPlate");
    const inputMake = document.getElementById("input_make");
    const inputModel = document.getElementById("input_model");
    const inputYear = document.getElementById("input_year");
    const inputSeats = document.getElementById("input_numberOfSeats");
    const inputFuel = document.getElementById("input_fuelType");

    const identifier = inputIdentifier.value;
    const registrationPlate = inputPlate.value;
    const make = inputMake.value;
    const model = inputModel.value;
    const year = inputYear.value;
    const numberOfSeats = inputSeats.value;
    const fuelType = inputFuel.value;

    if (!identifier || !registrationPlate || !make || !model || !year || !numberOfSeats || !fuelType ) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    fetch("http://localhost:8080/vehicles/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, registrationPlate, make, model, year, numberOfSeats, fuelType })
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao cadastrar veículo");
            return res.json();
        })
        .then(() => {
            alert("Veículo cadastrado com sucesso!");
        })
        .catch(err => {
            console.error(err);
            alert("Erro ao cadastrar veículo");
        });

    //Para limpar os campos do formulário
    inputIdentifier.value = "";
    inputPlate.value = "";
    inputMake.value = "";
    inputModel.value = "";
    inputYear.value = "";
    inputSeats.value = "";
    inputFuel.value = "";
}

function setupEvents() {
    document.getElementById("form-vehicle").addEventListener("submit", function (event) {
        event.preventDefault();
        cadastrarVeiculo();
    });
}

window.addEventListener("load", setupEvents);