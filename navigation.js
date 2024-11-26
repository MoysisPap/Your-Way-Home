// Google Maps code
let map;
let marker;

function initMap() {
  const initialLocation = { lat: 59.33091976142107, lng: 18.060195177256297 };
  const markerOffset = 0.001;

  map = new google.maps.Map(document.getElementById('map'), {
    center: initialLocation,
    zoom: 16,
    zoomControl: true, // Enable zoom control
    streetViewControl: true, // Enable street view control
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER, // Position zoom control at right center
    },
    streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER, // Position street view control at right center
    },
  });

  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: {
      lat: initialLocation.lat + markerOffset,
      lng: initialLocation.lng,
    },
  });

  google.maps.event.addListener(marker, 'dragend', function () {
    updateLocationInput(marker.getPosition());
  });
}
