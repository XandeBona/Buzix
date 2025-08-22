//Inicializa o mapa genérico (sem as coordenadas do usuário)
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

//Localização do usuário (em tempo real)
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
    }, function (error) {
        //Trativa de erros de geolocalização
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.warn("Usuário negou a solicitação de geolocalização.");
                document.getElementById("location-warning").style.display = "block";
                break;
            case error.POSITION_UNAVAILABLE:
                console.warn("Informações de localização indisponíveis.");
                break;
            case error.TIMEOUT:
                console.warn("O tempo para obter a localização expirou.");
                break;
            default:
                console.warn("Ocorreu um erro desconhecido:", error);
        }
    }, {
        enableHighAccuracy: true, //Tenta usar GPS/Wi-Fi para maior precisão
        maximumAge: 0,             //Não usa posição em cache, sempre tenta pegar a mais recente
        timeout: 10000             //Aguarda no máximo 10 segundos para obter a posição
    });
} else {
    //Se o navegador não suporta geolocalização
    document.getElementById("location-warning").innerText =
        "Seu navegador não suporta geolocalização.";
    document.getElementById("location-warning").style.display = "block";
}

//Customização do Icon do ponto no mapa
let iconOptions = {
    icon: L.icon({
        iconUrl: "IMAGES/buzix_logo2.png",
        iconSize: [100, 55],
        iconAnchor: [50, 55],
        popupAnchor: [0, -48], //Altera a altura do POP-UP padrão
    })
};

let busStopBigIcon = L.icon({
    iconUrl: "IMAGES/buzix_logo2.png",
    iconSize: [130, 75],
    iconAnchor: [65, 75],
    tooltipAnchor: [0, -69] //Altera a altura do POP-UP fixo
});



// -- Parte de mostrar as rotas no mapa //

// Layers
let busStopLayer = L.layerGroup().addTo(map);    // markers pequenos
let tripLayerGroup = L.layerGroup().addTo(map);  // markers grandes + linha da trip

// Variável para controlar trip ativa
let activeTripId = null;

// Adiciona os pontos pequenos no mapa
fetch("http://localhost:8080/busstops/all", { credentials: "include" })
    .then(res => res.json())
    .then(points => {
        points.forEach(p => {
            let marker = L.marker([p.latitude, p.longitude], iconOptions).addTo(busStopLayer);

            marker.on("click", () => {

                // Se houver trip ativa, fecha tudo antes de abrir o popup
                if (activeTripId) {
                    tripLayerGroup.clearLayers();
                    activeTripId = null;
                }

                // Busca rotas do ponto
                fetch(`http://localhost:8080/busstops/${p.id}/routes`, { credentials: "include" })
                    .then(res => res.json())
                    .then(routes => {
                        if (!routes.length) {
                            marker.bindPopup("Nenhuma linha passa aqui.").openPopup();
                            return;
                        }

                        // Monta conteúdo do popup
                        let content = `<b>Ponto:</b> ${p.identifier}<br><br>`; // nome do ponto em cima

                        content += "<b>Linhas:</b><ul>";
                        routes.forEach(r => {
                            content += `<li>
                            <a href='#' class='route-link' data-route='${r.id}' data-busstop='${p.id}'>
                                ${r.code} - ${r.name} 
                                <br>
                                ${r.description}
                                <br>
                            </a>
                        </li>`;
                        });
                        content += "</ul>";

                        marker.bindPopup(content).openPopup();

                        // Adiciona listeners para clique nas rotas
                        setTimeout(() => {
                            document.querySelectorAll(".route-link").forEach(link => {
                                link.addEventListener("click", e => {
                                    e.preventDefault();
                                    let routeId = e.target.dataset.route;
                                    let busStopId = e.target.dataset.busstop;

                                    // Fecha popup do ponto imediatamente
                                    marker.closePopup();

                                    // Busca trips dessa rota que passam neste ponto
                                    fetch(`http://localhost:8080/busstops/${busStopId}/routes/${routeId}/trips`, { credentials: "include" })
                                        .then(res => res.json())
                                        .then(trips => {
                                            if (!trips.length) return;

                                            let tripContent = "<b>Itinerários:</b><ul>";
                                            trips.forEach(t => {
                                                tripContent += `<li><a href='#' class='trip-link' data-id='${t.id}'>
                                            Saída ${t.departureTime} - Chegada ${t.arrivalTime}
                                        </a></li>`;
                                            });
                                            tripContent += "</ul>";

                                            // Atualiza popup com links de trips (ainda fechável pelo marker)
                                            marker.bindPopup(tripContent).openPopup();

                                            // Listeners para cada trip
                                            setTimeout(() => {
                                                document.querySelectorAll(".trip-link").forEach(tripLink => {
                                                    tripLink.addEventListener("click", e => {
                                                        e.preventDefault();
                                                        let tripId = e.target.dataset.id;

                                                        // Fecha popup do marker quando clica no link da trip
                                                        marker.closePopup();

                                                        // Toggle: se mesma trip → fecha
                                                        if (activeTripId === tripId) {
                                                            tripLayerGroup.clearLayers();
                                                            activeTripId = null;
                                                            return;
                                                        }

                                                        // Limpa trip anterior
                                                        tripLayerGroup.clearLayers();

                                                        // Busca trip completa
                                                        fetch(`http://localhost:8080/trips/${tripId}`, { credentials: "include" })
                                                            .then(res => res.json())
                                                            .then(trip => {
                                                                if (!trip.stopTimes.length) return;

                                                                let latlngs = [];

                                                                // Cria markers grandes apenas para a trip
                                                                trip.stopTimes.forEach(s => {
                                                                    let stopMarker = L.marker([s.latitude, s.longitude], { icon: busStopBigIcon })
                                                                        .bindTooltip(
                                                                            `<b>${s.stopSequence}ª parada - ${s.busStopIdentifier}</b><br>
                                                                                ⏱ Chegada: ${s.arrivalTime}<br>
                                                                                🚌 Saída: ${s.departureTime}`,
                                                                            { permanent: true, direction: "top" }
                                                                        );
                                                                    tripLayerGroup.addLayer(stopMarker);
                                                                    latlngs.push([s.latitude, s.longitude]);
                                                                });

                                                                // Desenha a linha
                                                                L.polyline(latlngs, { color: trip.routeColor, weight: 4 }).addTo(tripLayerGroup);

                                                                activeTripId = tripId;

                                                                // Zoom automático
                                                                let bounds = L.latLngBounds(latlngs);
                                                                map.fitBounds(bounds.pad(0.2));
                                                            });
                                                    });
                                                });
                                            }, 100);
                                        });
                                });
                            });
                        }, 100);
                    });
            });
        });
    })
    .catch(err => console.error(err));




//Mostrar menu ao clicar no nome de usuário (quando está logado)
document.getElementById("saudacao").addEventListener("click", function () {
    document.getElementById("card-logout").classList.toggle("hidden");
});

//Botão Editar (futuro redirecionamento)
document.getElementById("btn-editar").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/editar_usuario.html";
});

//Botão Sair
document.getElementById("btn-sair").addEventListener("click", function (e) {
    fetch("/auth/logout", {
        method: "POST",
        credentials: "include"
    }).then(() => {
        window.location.href = "/login.html";
    });
});

//Mostrar menu ao clicar no nome de usuário (visitante)
document.getElementById("saudacao").addEventListener("click", function () {
    document.getElementById("card-login").classList.toggle("hidden");
});

//Botão Logar
document.getElementById("btn-logar").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "login.html";
});

//Botão para fechar o aviso de geolocalização desabilitada
function closeWarning() {
    const closeBtn = document.getElementById("close-warning");
    const warningDiv = document.getElementById("location-warning");

    if (closeBtn && warningDiv) {
        closeBtn.addEventListener("click", function () {
            warningDiv.style.display = "none";
        });
    }
}

function carregarIndex() {
    const saudacaoDiv = document.getElementById("saudacao");
    const cardHeader = document.querySelector(".card-header");
    const dividerAdmin = document.querySelector(".divider-admin");
    const cardLogin = document.getElementById("card-login");

    fetch("http://localhost:8080/usuarios/me", { credentials: "include" })
        .then(res => {
            if (!res.ok) throw new Error("Não autenticado");
            return res.json();
        })
        .then(user => {
            const primeiroNome = user.userName.split(" ")[0];
            saudacaoDiv.innerText = `Olá, ${primeiroNome}!`;

            if (user.role !== "ROLE_ADMIN") {
                cardHeader.style.display = "none";
                dividerAdmin.style.display = "none";
            }

            if (user.role === "ROLE_USER" || user.role === "ROLE_ADMIN") {
                cardLogin.style.display = "none";
            }
        })
        .catch(err => {
            console.log("Usuário não autenticado", err);
            saudacaoDiv.innerText = "Olá, visitante!";
            document.getElementById("card-logout").style.display = "none";
        });
}

window.addEventListener("load", carregarIndex, closeWarning);