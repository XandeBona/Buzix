var routes = []; //Array para guardar as linhas
var input = document.getElementById("input_route");
var list = document.getElementById("route-options");

//Carrega as rotas
fetch("http://localhost:8080/routes/all")
  .then(res => res.json())
  .then(data => {
    routes = data; showOptions(routes);
  })
  .catch(err => console.error("Erro ao carregar linhas:", err));

//Função para criar os itens do dropdown
function showOptions(items) {
  list.innerHTML = "";
  items.forEach(r => {
    var li = document.createElement("li");
    li.textContent = r.code + " - " + r.name;
    li.dataset.id = r.id;
    li.addEventListener("click", function () {
      input.value = li.textContent;
      list.style.display = "none";
      input.dataset.selectedId = li.dataset.id;
    });
    list.appendChild(li);
  });
}

//Mostra todas as opções ao clicar em cima
input.addEventListener("focus", function () {
  list.style.display = "block";
});

//Filtrar opções enquanto digita
input.addEventListener("input", function () {
  var filter = input.value.toLowerCase();
  Array.from(list.children).forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(filter) ? "block" : "none";
  });
});

//Esconde o dropdown ao clicar fora
document.addEventListener("click", function (e) {
  if (!input.contains(e.target) && !list.contains(e.target)) {
    list.style.display = "none";
  }
});



var vehicles = []; //Array para guardar os veículos do backend
var vehicleInput = document.getElementById("input_vehicle");
var vehicleList = document.getElementById("vehicle-options");

//Carrega os veículos
fetch("http://localhost:8080/vehicles/all")
  .then(res => res.json())
  .then(data => {
    vehicles = data;
    showVehicleOptions(vehicles);
  });

//Função para criar os itens do dropdown
function showVehicleOptions(items) {
  vehicleList.innerHTML = "";
  items.forEach(v => {
    var li = document.createElement("li");
    li.textContent = "Veículo " + v.registrationPlate;
    li.dataset.id = v.id;
    li.addEventListener("click", function () {
      vehicleInput.value = li.textContent;
      vehicleList.style.display = "none";
      vehicleInput.dataset.selectedId = li.dataset.id;
    });
    vehicleList.appendChild(li);
  });
}

//Mostra todas as opções ao clicar em cima
vehicleInput.addEventListener("focus", function () {
  vehicleList.style.display = "block";
});

//Filtrar opções enquanto digita
vehicleInput.addEventListener("input", function () {
  var filter = vehicleInput.value.toLowerCase();
  Array.from(vehicleList.children).forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(filter) ? "block" : "none";
  });
});

//Esconde o dropdown ao clicar fora
document.addEventListener("click", function (e) {
  if (!vehicleInput.contains(e.target) && !vehicleList.contains(e.target)) {
    vehicleList.style.display = "none";
  }
});