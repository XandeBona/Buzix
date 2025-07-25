let mapOptions = {
    center:[-26.8255, -49.2726],
    zoom:15
}

let map = new L.map('map' , mapOptions);

let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layer);

let marker = new L.Marker([-26.8255, -49.2726]);
marker.addTo(map);


let marker2 = new L.Marker([-26.822931, -49.2761434]);
marker2.addTo(map);