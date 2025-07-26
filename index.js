let mapOptions = {
    center: [-26.8255, -49.2726],
    zoom: 15
}

let map = new L.map('map', mapOptions);

let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layer);




let customIcon = {
    iconUrl: 'IMAGES/logo_ico.ico',
    iconSize: [40, 40]
};

let myIcon = L.icon(customIcon);

let iconOptions = {
    title: "ponto 1",
    icon: myIcon
};


let marker = new L.Marker([-26.8255, -49.2726], iconOptions);
marker.addTo(map);


let marker2 = new L.Marker([-26.822931, -49.2761434], iconOptions);
marker2.addTo(map);