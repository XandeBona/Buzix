// --- Para o campo input que possui pesquisa no formulário --- //

var trips = []; //Array para guardar os itinerários
var tripInput = document.getElementById("input_trip");
var tripList = document.getElementById("trip-options");

//Carrega os itinerários
fetch("/trips/all")
    .then(res => res.json())
    .then(data => {
        trips = data;
        showTripOptions(trips);
    })
    .catch(err => console.error("Erro ao carregar itinerários:", err));

//Função para criar os itens do dropdown
function showTripOptions(items) {
    tripList.innerHTML = "";
    items.forEach(t => {
        var li = document.createElement("li");
        li.textContent = t.routeName + " | " + t.departureTime + " -> " + t.arrivalTime;
        li.dataset.id = t.id;
        li.addEventListener("click", function () {
            tripInput.value = li.textContent;
            tripList.style.display = "none";
            tripInput.dataset.selectedId = li.dataset.id;
        });
        tripList.appendChild(li);
    });
}

//Mostra todas as opções ao clicar em cima
tripInput.addEventListener("focus", function () {
    tripList.style.display = "block";
});

//Filtrar opções enquanto digita
tripInput.addEventListener("input", function () {
    var filter = tripInput.value.toLowerCase();
    Array.from(tripList.children).forEach(li => {
        li.style.display = li.textContent.toLowerCase().includes(filter) ? "block" : "none";
    });
});

//Esconde o dropdown ao clicar fora
document.addEventListener("click", function (e) {
    if (!tripInput.contains(e.target) && !tripList.contains(e.target)) {
        tripList.style.display = "none";
    }
});

var busStops = []; //Array para guardar os pontos de ônibus
var busStopInput = document.getElementById("input_busStop");
var busStopList = document.getElementById("busStop-options");

//Carrega os pontos de ônibus
fetch("/busstops/all")
    .then(res => res.json())
    .then(data => {
        busStops = data;
        showBusStopOptions(busStops);
    })
    .catch(err => console.error("Erro ao carregar busStops:", err));

//Função para criar os itens do dropdown
function showBusStopOptions(items) {
    busStopList.innerHTML = "";
    items.forEach(b => {
        var li = document.createElement("li");
        li.textContent = b.identifier;
        li.dataset.id = b.id;
        li.addEventListener("click", function () {
            busStopInput.value = li.textContent;
            busStopList.style.display = "none";
            busStopInput.dataset.selectedId = li.dataset.id;
        });
        busStopList.appendChild(li);
    });
}

//Mostra todas as opções ao clicar em cima
busStopInput.addEventListener("focus", function () {
    busStopList.style.display = "block";
});

//Filtrar opções enquanto digita
busStopInput.addEventListener("input", function () {
    var filter = busStopInput.value.toLowerCase();
    Array.from(busStopList.children).forEach(li => {
        li.style.display = li.textContent.toLowerCase().includes(filter) ? "block" : "none";
    });
});

//Esconde o dropdown ao clicar fora
document.addEventListener("click", function (e) {
    if (!busStopInput.contains(e.target) && !busStopList.contains(e.target)) {
        busStopList.style.display = "none";
    }
});



// --- Para cadastrar a parada  --- //

//Cadastra a parada
function cadastrarParada() {
    const inputTrip = document.getElementById("input_trip");
    const inputBusStop = document.getElementById("input_busStop");
    const inputStopSequence = document.getElementById("input_stopSequence");
    const inputArrival = document.getElementById("input_arrivalTime");
    const inputDeparture = document.getElementById("input_departureTime");

    //Garante que o usuário selecionou uma opção da lista
    if (!inputTrip.dataset.selectedId || !inputBusStop.dataset.selectedId) {
        alert("Selecione uma opção válida para Itinerário e Ponto de ônibus!");
        return;
    }

    if (!inputStopSequence.value || !inputArrival.value || !inputDeparture.value) {
        alert("Preencha todos os campos corretamente!");
        return;
    }


    //Monta o objeto para o StopTimeRequestDTO
    const stopTimeRequest = {
        tripId: parseInt(inputTrip.dataset.selectedId),
        busStopId: parseInt(inputBusStop.dataset.selectedId),
        stopSequence: parseInt(inputStopSequence.value),
        arrivalTime: inputArrival.value + ":00",   //Formatação para LocalTime (horário)
        departureTime: inputDeparture.value + ":00"
    };

    //Envia para o backend
    fetch("/stoptimes/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stopTimeRequest)
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao cadastrar parada");
            return res.json();
        })
        .then(data => {
            alert("Parada cadastrada com sucesso!");

            //Para limpar os campos do formulário
            inputTrip.value = "";
            inputBusStop.value = "";
            inputStopSequence.value = "";
            inputArrival.value = "";
            inputDeparture.value = "";

            inputTrip.dataset.selectedId = null;
            inputBusStop.dataset.selectedId = null;
        })
        .catch(err => {
            console.error(err);
            alert("Erro ao cadastrar parada");
        });
}

//Configura o evento de submit do formulário
function setupEvents() {
    document.getElementById("form-stopTime").addEventListener("submit", function (event) {
        event.preventDefault();
        cadastrarParada();
    });
}

//Configura os eventos ao carregar a página
window.addEventListener("load", setupEvents);