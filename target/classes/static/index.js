//Inicializa o mapa genérico (sem as coordenadas do cliente)
let initialLat = -26.8198387;
let initialLng = -49.2725219;

let map = L.map('map').setView([initialLat, initialLng], 15);

//Camada OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

//Marcador inicial
let marker = L.marker([initialLat, initialLng]).addTo(map)
    .bindPopup("Carregando sua localização...")
    .openPopup();

//Localização real do usuário (em tempo real)
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function (pos) {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;

        //Atualiza o marcador
        marker.setLatLng([lat, lng]);

        //Se a precisão da posição for menor que 50 metros
        if (accuracy < 50) {
            //Atualiza o conteúdo do popup do marcador indicando que a posição é precisa
            marker.setPopupContent("Sua localização :)").openPopup();
        } else {
            //Indica que é apenas aproximada
            marker.setPopupContent("Sua localização :)").openPopup();
        }

        //Centraliza o mapa na posição atual do usuário
        map.setView([lat, lng], 15);

        //Atualiza as coordenadas exibidas na tela
        document.getElementById('coordinates').textContent =
            `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`;

        //Opções do watchPosition
    }, null, {
        enableHighAccuracy: true, // Tenta usar GPS/Wi-Fi para maior precisão
        maximumAge: 0,             // Não usa posição em cache, sempre tenta pegar a mais recente
        timeout: 10000             // Aguarda no máximo 10 segundos para obter a posição
    });
}

//Customização do Icon do ponto no mapa
let customIcon = {
    iconUrl: 'IMAGES/buzix_logo2.png',
    iconSize: [100, 55],
    popupAnchor: [0, -20]
};

let myIcon = L.icon(customIcon);
let iconOptions = { icon: myIcon };

// let marker = new L.Marker([-26.823465, -49.274973], iconOptions);
// marker.addTo(map);
// marker.bindPopup("Terminal");

// let marker2 = new L.Marker([-26.833013, -49.2594779], iconOptions);
// marker2.addTo(map);

// let marker3 = new L.Marker([-26.8408301, -49.27368], iconOptions);
// marker3.addTo(map);

// let marker4 = new L.Marker([-26.83077, -49.273812], iconOptions);
// marker4.addTo(map);

// let marker5 = new L.Marker([-26.80859, -49.257442], iconOptions);
// marker5.addTo(map);

// let marker6 = new L.Marker([-26.81171, -49.27033], iconOptions);
// marker6.addTo(map);

// let marker7 = new L.Marker([-26.81179, -49.27078], iconOptions);
// marker7.addTo(map);

// Alternar card ao clicar na saudação
document.getElementById("saudacao").addEventListener("click", function () {
    document.getElementById("card-logout").classList.toggle("hidden");
});

// Botão Editar (futuro redirecionamento)
document.getElementById("btn-editar").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "#";
});

// Botão Sair
document.getElementById("btn-sair").addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
});

document.getElementById("saudacao").addEventListener("click", function () {
    document.getElementById("card-login").classList.toggle("hidden");
});

// Botão Logar
document.getElementById("btn-logar").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "login.html";
});

function carregarIndex() {
    const token = localStorage.getItem("token");
    const saudacaoDiv = document.getElementById("saudacao");
    const cardHeader = document.querySelector(".card-header");
    const dividerAdmin = document.querySelector(".divider-admin");
    const cardLogin = document.getElementById("card-login");

    if (token) {
        fetch("http://localhost:8080/usuarios/me", {
            headers: { Authorization: "Bearer " + token }
        })
            .then(res => res.json())
            .then(user => {
                saudacaoDiv.innerText = `Olá, ${user.userName}!`;

                // Se não for ADMIN, esconde o link
                if (user.role !== "ROLE_ADMIN") {
                    cardHeader.style.display = "none";
                    dividerAdmin.style.display = "none";
                }
                if (user.role === "ROLE_USER" || user.role === "ROLE_ADMIN") {
                    cardLogin.style.display = "none";
                }
            })
            .catch(err => {
                console.log("Token inválido ou expirado", err);
                localStorage.removeItem("token");
                saudacaoDiv.innerText = "Olá, visitante!";
            });
    } else {
        saudacaoDiv.innerText = "Olá, visitante!";
        document.getElementById("card-logout").style.display = "none";
    }
}

window.addEventListener("load", carregarIndex);

// --- LINK PARA EMPRESA ---
document.getElementById("link-empresa")?.addEventListener("click", function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    fetch("/empresa", {
        headers: { "Authorization": "Bearer " + token }
    })
        .then(res => {
            if (res.status === 403) {
                alert("Você não tem permissão para acessar esta página.");
                window.location.href = "/login.html";
            } else {
                return res.text();
            }
        })
        .then(html => {
            if (html) document.body.innerHTML = html;
        })
        .catch(err => console.log("Erro ao carregar empresa", err));
});