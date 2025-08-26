// -- Parte do carregamento do mapa no index + localização do usuário -- //

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

//Localização do usuário (a cada 1min30s)
if (navigator.geolocation) {

    function buscarLocalizacao() {
        navigator.geolocation.getCurrentPosition(function (pos) {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const accuracy = pos.coords.accuracy;

            //Atualiza o marcador
            marker.setLatLng([lat, lng]);

            //Se a precisão da posição for menor que 50 metros
            if (accuracy < 50) {
                marker.setPopupContent("Sua localização :)").openPopup();
            } else {
                marker.setPopupContent("Sua localização :)").openPopup();
            }

            //Centraliza o mapa na posição atual do usuário
            map.setView([lat, lng], 15);

            //Atualiza as coordenadas exibidas na tela
            document.getElementById('coordinates').textContent =
                `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`;

        }, function (error) {
            //Tratativa de erros
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
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
        });
    }

    //Executa imediatamente na primeira vez
    buscarLocalizacao();

    //Depois da primeira vez, busca a localização a cada 90 segundos
    setInterval(buscarLocalizacao, 90000);

} else {
    document.getElementById("location-warning").innerText =
        "Seu navegador não suporta geolocalização.";
    document.getElementById("location-warning").style.display = "block";
}

//Customização do Icon do ponto no mapa
let iconOptions = {
    icon: L.icon({
        iconUrl: "/IMAGES/buzix_logo2.png",
        iconSize: [100, 55],
        iconAnchor: [50, 55],
        popupAnchor: [0, -48], //Altera a altura do POP-UP padrão
    })
};

let busStopBigIcon = L.icon({
    iconUrl: "/IMAGES/buzix_logo2_alter.png",
    iconSize: [132, 77],
    iconAnchor: [65, 75],
    tooltipAnchor: [0, -69], //Altera a altura do POP-UP fixo
});


// -- Parte de mostrar as rotas no mapa -- //

//Layers (camadas do Leaflet)
let busStopLayer = L.layerGroup().addTo(map);    //Markers pequenos (pontos de ônibus) - padrão 
let tripLayerGroup = L.layerGroup().addTo(map);  //Markers grandes + linha da trip - ao mostrar a Route no mapa

//Variável para controlar trip ativa
let activeTripId = null;

//Para salvar a rota no cache
let routeCache = {}; // memória local

// -- Funções de Cache e LocalStorage (para não utilizar todas as requisições de rotas do plano Free do GraphHopper) -- //

//Salva a rota no cache (memória e localStorage).
function saveRouteToCache(key, path) {
    routeCache[key] = path;
    localStorage.setItem(key, JSON.stringify(path));
}

//Busca a rota do cache (memória ou localStorage).
function getRouteFromCache(key) {
    if (routeCache[key]) return routeCache[key];
    let item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

// -- Funções de Rotas (GraphHopper) -- //

//Divide a Linha em até 5 pontos, busca a rota de cada segmento de 5 pontos no GraphHopper, junta tudo em 1 única rota com cache
async function fetchGraphHopperRoute(latlngs, color, tripId) {
    if (latlngs.length < 2) return;

    const key = "trip_" + tripId;

    //Verifica cache
    let cached = getRouteFromCache(key);
    if (cached) {
        L.polyline(cached, { color, weight: 4 }).addTo(tripLayerGroup);
        return;
    }

    let allCoords = [];

    //Divide em segmentos de 5 pontos (GraphHopper não aceita mais que 5 pontos no plano Free)
    for (let i = 0; i < latlngs.length; i += 4) {
        let segment = latlngs.slice(i, i + 5);

        let urlPoints = segment.map(c => `point=${c[0]},${c[1]}`).join("&");

        try {
            //Aqui a chamada vai para o backend, que tem a key segura
            let res = await fetch(`/api/route?${urlPoints}`, { credentials: "include" });
            let data = await res.json();

            if (data.paths && data.paths[0]) {
                let coords = data.paths[0].points.coordinates.map(c => [c[1], c[0]]);

                if (allCoords.length > 0) {
                    //Garante que a junção dos segmentos não fique fora de ordem e sem duplicação
                    const lastAll = allCoords[allCoords.length - 1];
                    const firstSeg = coords[0];
                    const lastSeg = coords[coords.length - 1];

                    if (firstSeg[0] === lastAll[0] && firstSeg[1] === lastAll[1]) {
                        coords.shift(); // remove ponto duplicado
                    } else if (lastSeg[0] === lastAll[0] && lastSeg[1] === lastAll[1]) {
                        //Se o marcador veio invertido, inverte
                        coords.reverse();
                        coords.shift(); //Remove duplicado após reversão
                    }
                }

                allCoords.push(...coords);
            }
        } catch (err) {
            console.error("Erro ao buscar rota do backend:", err);
        }
    }

    //Salva no cache e adiciona ao mapa
    if (allCoords.length > 0) {
        saveRouteToCache(key, allCoords);
        L.polyline(allCoords, { color, weight: 4 }).addTo(tripLayerGroup);
    }
}

// -- Funções de Interface -- //

//Renderiza a lista de linhas (routes) em um popup no ponto de ônibus
function renderRoutesPopup(marker, p, routes) {
    if (!routes.length) {
        marker.bindPopup(`<b>Ponto:</b> ${p.identifier}<br><br>Nenhuma linha passa aqui.`).openPopup();
        return;
    }

    let content = `<b>Ponto:</b> ${p.identifier}<br><br><b>Linhas:</b><ul>`;
    routes.forEach(r => {
        content += `<li>
            <a href='#' class='route-link' data-route='${r.id}' data-busstop='${p.id}'>
                ${r.code} - ${r.name}<br>${r.description}<br>
            </a></li>`;
    });
    content += "</ul>";

    marker.bindPopup(content).openPopup();

    // Após exibir popup, adiciona eventos nos links
    setTimeout(() => attachRouteLinkEvents(marker), 100);
}

//Renderiza a lista de itinerários (trips) no popup
function renderTripsPopup(marker, trips) {
    if (!trips.length) return;

    let tripContent = "<b>Itinerários:</b><ul>";
    trips.forEach(t => {
        tripContent += `<li><a href='#' class='trip-link' data-id='${t.id}'>
            Saída ${t.departureTime.slice(0, 5)} - Chegada ${t.arrivalTime.slice(0, 5)}</a></li>`;
    });
    tripContent += "</ul>";

    marker.bindPopup(tripContent).openPopup();

    //Após exibir popup, adiciona eventos nos links
    setTimeout(() => attachTripLinkEvents(marker), 100);
}

// -- Funções de Eventos -- //

//Liga eventos nos links de linhas (routes)
function attachRouteLinkEvents(marker) {
    document.querySelectorAll(".route-link").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            let routeId = e.target.dataset.route;
            let busStopId = e.target.dataset.busstop;

            marker.closePopup();
            fetchTrips(marker, busStopId, routeId);
        });
    });
}

//Liga eventos nos links de itinerários (trips)
function attachTripLinkEvents(marker) {
    document.querySelectorAll(".trip-link").forEach(tripLink => {
        tripLink.addEventListener("click", e => {
            e.preventDefault();
            let tripId = e.target.dataset.id;
            marker.closePopup();
            handleTripSelection(tripId);
        });
    });
}

// -- Funções de Fetch -- //

//Busca rotas de um ponto específico
function fetchRoutes(marker, busStopId) {
    fetch(`/busstops/${busStopId}/routes`, { credentials: "include" })
        .then(res => res.json())
        .then(routes => renderRoutesPopup(marker, { id: busStopId, identifier: marker.options.title }, routes));
}


//Busca itinerários de uma rota em um ponto específico
function fetchTrips(marker, busStopId, routeId) {
    fetch(`/busstops/${busStopId}/routes/${routeId}/trips`, { credentials: "include" })
        .then(res => res.json())
        .then(trips => renderTripsPopup(marker, trips));
}

//Lida com a seleção de uma trip: exibe markers grandes e rota no mapa
function handleTripSelection(tripId) {
    if (activeTripId === tripId) {
        tripLayerGroup.clearLayers();
        activeTripId = null;
        return;
    }

    tripLayerGroup.clearLayers();

    fetch(`/trips/${tripId}`, { credentials: "include" })
        .then(res => res.json())
        .then(trip => {
            if (!trip.stopTimes.length) return;

            let latlngs = [];
            trip.stopTimes.forEach(s => {
                let stopMarker = L.marker([s.latitude, s.longitude], { icon: busStopBigIcon })
                    .bindTooltip(
                        `<b>${s.stopSequence}ª parada - ${s.busStopIdentifier}</b><br>
                        ⏱ Chegada: ${s.arrivalTime.slice(0, 5)}<br>🚌 Saída: ${s.departureTime.slice(0, 5)}`,
                        { permanent: true, direction: "top" }
                    );
                tripLayerGroup.addLayer(stopMarker);
                latlngs.push([s.latitude, s.longitude]);
            });

            //Busca rota no GraphHopper
            fetchGraphHopperRoute(latlngs, trip.routeColor, tripId);

            activeTripId = tripId;
            let bounds = L.latLngBounds(latlngs);
            map.fitBounds(bounds.pad(0.2));
        });
}

// --  Adiciona os pontos de ônibus no mapa -- //
function loadBusStops() {
    fetch("/busstops/all", { credentials: "include" })
        .then(res => res.json())
        .then(points => {
            points.forEach(p => {
                let marker = L.marker([p.latitude, p.longitude], iconOptions).addTo(busStopLayer);
                marker.options.title = p.identifier; //Para usar depois no popup
                marker.on("click", () => {
                    if (activeTripId) {
                        tripLayerGroup.clearLayers();
                        activeTripId = null;
                    }
                    fetchRoutes(marker, p.id);
                });
            });
        })
        .catch(err => console.error(err));
}


// -- Parte da Barra de Pesquisa -- //

const searchInput = document.getElementById('input-search');
const searchResults = document.getElementById('searchResults');
let searchMarker = null; //Marcador para o resultado da barra de pesquisa

//Função de pesquisa
function searchStreet() {
    const query = searchInput.value.trim();
    if (!query) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`; //API Nominatim - limite de 5 para não aparecer resultados excessivos

    fetch(url)
        .then(res => res.json())
        .then(data => showResults(data))
        .catch(err => console.error("Erro na busca:", err));
}

//Exibe resultados
function showResults(results) {
    searchResults.innerHTML = "";

    results.forEach(place => {
        const li = document.createElement("li");
        li.textContent = place.display_name;

        li.addEventListener("click", () => {
            //Centraliza o mapa no local
            map.setView([place.lat, place.lon], 16);

            //Adiciona o marcador
            if (searchMarker) {
                searchMarker.setLatLng([place.lat, place.lon]);
            } else {
                searchMarker = L.marker([place.lat, place.lon]).addTo(map);
            }

            searchMarker.unbindPopup();

            //Limpa lista de resultados
            searchResults.innerHTML = "";
        });

        searchResults.appendChild(li);
    });
}

//Ativa pesquisa ao clicar na lupa
document.querySelector('.lupa-icon').addEventListener('click', searchStreet);

//Ativa pesquisa ao pressionar Enter no input
searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') searchStreet();
});

//Fecha lista se clicar fora
document.addEventListener('click', function (e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.innerHTML = "";
    }
});



// -- Parte do Menu do Usuário -- //

//Mostrar menu ao clicar no nome de usuário (quando está logado)
document.getElementById("saudacao").addEventListener("click", function () {
    document.getElementById("card-logout").classList.toggle("hidden");
});

//Botão Editar (futuro redirecionamento)
document.getElementById("btn-editar").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/html/editar_usuario.html";
});

//Botão Sair
document.getElementById("btn-sair").addEventListener("click", function (e) {
    fetch("/auth/logout", {
        method: "POST",
        credentials: "include"
    }).then(() => {
        window.location.href = "/html/login.html";
    });
});

//Mostrar menu ao clicar no nome de usuário (visitante)
document.getElementById("saudacao").addEventListener("click", function () {
    document.getElementById("card-login").classList.toggle("hidden");
});

//Botão Logar
document.getElementById("btn-logar").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/html/login.html";
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

    fetch("/usuarios/me", { credentials: "include" })
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

window.addEventListener("load", carregarIndex, closeWarning, loadBusStops());