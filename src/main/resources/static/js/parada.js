var trips = []; //Array para guardar os itinerários
var tripInput = document.getElementById("input_trip");
var tripList = document.getElementById("trip-options");

//Carrega os itinerários
fetch("http://localhost:8080/trips/all")
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
fetch("http://localhost:8080/busstops/all")
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