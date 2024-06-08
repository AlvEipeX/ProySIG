var marker = null;
var userLocation;
var selectedDestination;
var routingControl;
var datos_recorrido;

var coordenadasRecibidas = [];

$(document).ready(function () {
  $("#sidebarCollapse").on("click", function () {
    $("#sidebar").toggleClass("active");
    $("#icon").toggleClass("fa-arrow-circle-left fa-arrow-circle-right");
  });
});

/* -MAPA 1-------------------------------------------------------------------------------------- */

var map1 = L.map("map1", {
  center: [-17.964138034171146, -67.10734251787665],
  zoom: 15,
  maxZoom: 18,
  minZoom: 14,
});

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
).addTo(map1);

var osmLayer = new L.TileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

var miniMap = new L.Control.MiniMap(osmLayer, {
  toggleDisplay: true,
  minimized: false,
}).addTo(map1);

var usuarioIcon = L.divIcon({
  html: '<i class="fa fa-map-marker fa-3x"></i>',
  className: "usuario-icon",
});

function onLocationFound(e) {
  userLocation = e.latlng;
  L.marker(e.latlng).addTo(map1).bindPopup("Usted esta aqui").openPopup();
  map1.setView(e.latlng, 15);
}

function onLocationError(e) {
  alert(e.message);
}

// Solicitar la ubicación del usuario
map1.on("locationfound", onLocationFound);
map1.on("locationerror", onLocationError);

// Iniciar la solicitud de geolocalización
map1.locate({ setView: true, maxZoom: 16 });

function generateRoute() {
  if (!userLocation || !selectedDestination) {
    alert("Usuario o destino no encontrados");
    return;
  }
  if (routingControl) {
    map1.removeControl(routingControl);
  }
  routingControl = L.Routing.control({
    waypoints: [userLocation, selectedDestination],
    routeWhileDragging: true,
  }).addTo(map1);
}

document.getElementById("routeButton").addEventListener("click", generateRoute);

function adjustCoordinatesToRight(coords, offset) {
  return [coords[0], coords[1] + offset];
}

/* -LINEA PRINCIPAL-------------------------------------------------------------------------------------- */
var inicio_mark = L.marker([-17.957698858097284, -67.10479645507664]).addTo(
  map1
);
inicio_mark.bindPopup("Inicio del recorrido");

var final_mark = L.marker([-17.967469390470484, -67.11855552699116]).addTo(
  map1
);
final_mark.bindPopup("Final del recorrido");

fetch("/obtener_puntos_recorrido/")
  .then((response) => response.json())
  .then((data) => {
    var rec_carnaval = data.map((coord) => [coord.latitud, coord.longitud]);
    var polylineOptions = {
      color: "orange",
      weight: 8,
      opacity: 0.7,
      lineCap: "round",
      lineJoin: "round",
    };
    L.polyline(rec_carnaval, polylineOptions).addTo(map1);
  })
  .catch((error) => console.error("Error:", error));

/* -puntos de interes-------------------------------------------------------------------------------------- */

var saludIcon = L.divIcon({
  html: '<i class="fa fa-plus-square fa-2x"></i>',
  className: "salud-icon",
});

var seguridadIcon = L.icon({
  iconUrl: "static/img/mapa/logo_policia.png", // Ruta relativa a la imagen local
  iconSize: [38, 38], // Tamaño del icono [ancho, alto]
  iconAnchor: [19, 38], // Punto del icono que se corresponderá con la posición del marcador
  popupAnchor: [0, -38],
});

var depositoIcon = L.divIcon({
  html: '<i class="fa fa-dumpster fa-2x"></i>',
  className: "deposito-icon",
});

var pasoIcon = L.divIcon({
  html: '<span class="fa-stack fa-lg"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-walking fa-stack-1x"></i>',
  className: "paso-icon",
});

var saludMarkers = L.layerGroup();
var seguridadMarkers = L.layerGroup();
var depositoMarkers = L.layerGroup();
var pasoMarkers = L.layerGroup();

document.addEventListener("DOMContentLoaded", function () {
  fetch("/obtener_punto_carnaval/")
    .then((response) => response.json())
    .then((data) => {
      var puntos = data; // Asigna los datos a la variable global
      puntos.forEach(function (data) {
        if (data.titulo == "Puesto de Salud") {
          var mark_salud = L.marker(data.coord, { icon: saludIcon }).addTo(
            saludMarkers
          );
          mark_salud.on("click", function () {
            var adjustedCoord = adjustCoordinatesToRight(data.coord, 0.003);
            map1.setView(adjustedCoord, 16);
            document.getElementById("titulo-info").innerHTML = data.titulo;
            document.getElementById("marker-info").innerHTML = data.direccion;
            document.getElementById("marker-image").src = data.imagen_ruta;
            var card = document.getElementById("card-info");
            card.style.display = "block";
            selectedDestination = data.coord;
          });
          saludMarkers.addTo(map1);
        }
        if (data.titulo == "Deposito residual") {
          var mark_deposito = L.marker(data.coord, {
            icon: depositoIcon,
          }).addTo(depositoMarkers);

          mark_deposito.on("click", function () {
            var adjustedCoord = adjustCoordinatesToRight(data.coord, 0.003); // Ajustar 0.005 grados a la derecha
            map1.setView(adjustedCoord, 16);
            document.getElementById("titulo-info").innerHTML = data.titulo;
            document.getElementById("marker-info").innerHTML = data.direccion;
            document.getElementById("marker-image").src = data.imagen_ruta;
            var card = document.getElementById("card-info");
            card.style.display = "block";
            selectedDestination = data.coord;
          });
          depositoMarkers.addTo(map1);
        }
        if (data.titulo == "Puesto Policial") {
          var mark_seguridad = L.marker(data.coord, {
            icon: seguridadIcon,
          }).addTo(seguridadMarkers);

          mark_seguridad.on("click", function () {
            var adjustedCoord = adjustCoordinatesToRight(data.coord, 0.003); // Ajustar 0.005 grados a la derecha
            map1.setView(adjustedCoord, 16);
            document.getElementById("titulo-info").innerHTML = data.titulo;
            document.getElementById("marker-info").innerHTML = data.direccion;
            document.getElementById("marker-image").src = data.imagen_ruta;
            var card = document.getElementById("card-info");
            card.style.display = "block";
            selectedDestination = data.coord;
          });
          seguridadMarkers.addTo(map1);
        }
        if (data.titulo == "Paso Peatonal") {
          var mark_paso = L.marker(data.coord, { icon: pasoIcon }).addTo(
            pasoMarkers
          );
          mark_paso.on("click", function () {
            var adjustedCoord = adjustCoordinatesToRight(data.coord, 0.003); // Ajustar 0.005 grados a la derecha
            map1.setView(adjustedCoord, 16);
            document.getElementById("titulo-info").innerHTML = data.titulo;
            document.getElementById("marker-info").innerHTML = data.direccion;
            document.getElementById("marker-image").src = data.imagen_ruta;
            var card = document.getElementById("card-info");
            card.style.display = "block";
            selectedDestination = data.coord;
          });

          pasoMarkers.addTo(map1);
        }
      });
      var overlayMaps = {
        '<i class="fa fa-plus-square fa-lg salud-icon"></i> Puestos de Salud':
          saludMarkers,
        "Puestos de policia": seguridadMarkers,
        '<i class="fa fa-dumpster fa-lg deposito-icon"></i>  Depositos de basura':
          depositoMarkers,
        '<i class="fa fa-walking fa-lg paso-icon"></i> Paso peatonal':
          pasoMarkers,
      };

      L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map1);
    })
    .catch((error) => console.error("Error:", error));
});
