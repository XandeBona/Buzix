// Local de abertura do Mapa (ao carregar a página)
let mapOptions = {
    center: [-26.8255, -49.2726],
    zoom: 15
}

let map = new L.map('map', mapOptions);

let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layer);



//Customização do Icon do ponto no mapa
let customIcon = {
    iconUrl: 'IMAGES/buzix_logo2.png',
    iconSize: [100, 55],
    popupAnchor: [0, -20]

};

let myIcon = L.icon(customIcon);

let iconOptions = {
    icon: myIcon
};

const saudacao = document.getElementById("saudacao");
const cardLogout = document.getElementById("card-logout");
const btnLogout = document.getElementById("btn-logout");

saudacao.addEventListener("click", () => {
  cardLogout.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
  if (!saudacao.contains(e.target) && !cardLogout.contains(e.target)) {
    cardLogout.classList.add("hidden");
  }
});

btnLogout.addEventListener("click", (e) => {
  e.preventDefault();
  // Aqui você pode apagar session/localStorage, cookies, etc.
  alert("Você saiu da conta.");
  window.location.href = "login.html";
});

let marker = new L.Marker([-26.823465, -49.274973], iconOptions);
marker.addTo(map);
marker.bindPopup("Terminal");

let marker2 = new L.Marker([-26.833013, -49.2594779], iconOptions);
marker2.addTo(map);

let marker3 = new L.Marker([-26.8408301, -49.27368], iconOptions);
marker3.addTo(map);

let marker4 = new L.Marker([-26.83077, -49.273812], iconOptions);
marker4.addTo(map);

let marker5 = new L.Marker([-26.80859, -49.257442], iconOptions);
marker5.addTo(map);

let marker6 = new L.Marker([-26.81171, -49.27033], iconOptions);
marker6.addTo(map);

let marker7 = new L.Marker([-26.81179, -49.27078], iconOptions);
marker7.addTo(map);


function carregarIndex() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const saudacaoDiv = document.getElementById("saudacao");

    if (token) {
        fetch("http://localhost:8080/usuarios/me", {
            headers: { Authorization: "Bearer " + token }
        })
        .then(res => res.json())
        .then(user => {
            saudacaoDiv.innerText = `Olá, ${user.userName}!`;
        })
        .catch(err => {
            console.log("Token inválido ou expirado", err);
            localStorage.removeItem("token");
        });
    } else {
        saudacaoDiv.innerText = "Olá, visitante!";
    }
};

window.addEventListener("load", carregarIndex);