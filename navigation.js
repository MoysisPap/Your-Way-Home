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

// Show the Google Sign-In div when the page is clicked
document.body.addEventListener('click', function () {
  const signInDiv = document.getElementById('googleSignInDiv');
  signInDiv.style.display = 'block';
});

// Close the Google Sign-In div when the close image is clicked
document.getElementById('closeButton').addEventListener('click', function (event) {
  event.stopPropagation(); // Prevent the click from propagating to the body
  document.getElementById('googleSignInDiv').style.display = 'none';
});


// Enable the "Continue with Google" button only if the checkbox is checked
document.getElementById('termsCheckbox').addEventListener('change', function () {
  const googleSignInButton = document.getElementById('googleSignInButton');
  if (this.checked) {
    googleSignInButton.disabled = false;
  } else {
    googleSignInButton.disabled = true;
  }
});

// Optional: Handle the "Continue with Google" button click
document.getElementById('googleSignInButton').addEventListener('click', function () {
  alert('Redirecting to Google Sign-In...');
  // Add your Google sign-in logic here
});

