// Create the base map
var baseMap = L.map("map", {
    center: [38.56, -121.73], //Sacramento, California
    zoom: 6
  });


// Connecting to Mapbox with API token

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
    accessToken: API_KEY
}).addTo(baseMap);


// get the url for the earthquake data
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2022-07-01&endtime=" +
"2022-07-03&maxlongitude=170.52148437&minlongitude=-150.83789062&maxlatitude=80.74894534&minlatitude=-85.16517337";


// create a function that changes marker size depending on the magnitude values
function markerSize(magnitude){
    return magnitude * 5
}

// Colouring circles based on magnitude 
function getColours(d) {
  if (d < 1){
    return "#4DFF88"
  }
  else if ( d < 2){
    return "#A6FF4D"
  }
  else if (d < 3){
    return "#FFFF4D"
  }
  else if (d < 4){
    return "#FFC34D"
  }
  else if (d < 5 ){
    return "#FF884D"
  }
  else {
    return "#FF4D4D"
  }
};

// Market creation
function createCircleMarker(feature, LatitudeLongitude ){

// Change the values of these options to change the symbol's appearance
  var markerOptions = {
    radius: markerSize(feature.properties.mag),
    fillColor: getColours(feature.properties.mag),
    color: "black",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.75
  }
  return L.circleMarker( LatitudeLongitude, markerOptions );
};
  
// Use json request to fetch the data from the queryURL
d3.json(queryUrl, function(data) {
//  console.log(data)
  var earthquakes = data.features
//  console.log(earthquakes)
  
    // Pop-ups for the circles
    earthquakes.forEach(function(result){
    L.geoJSON(result,{
      pointToLayer: createCircleMarker
    }).bindPopup("Date: " + new Date(result.properties.time) + 
                "<br>Place: " + result.properties.place + 
                "<br>Magnitude: " + result.properties.mag).addTo(baseMap)
  });

  // Legends
  var legend = L.control({position: "bottomright" });
  legend.onAdd = function(){
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5]
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColours(grades[i]) + '"></i> ' +
            grades[i] + (grades[i +1 ] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(baseMap);
});
