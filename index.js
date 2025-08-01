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



