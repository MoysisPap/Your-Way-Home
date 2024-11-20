// Add a flag to track if the form has been submitted
let formSubmitted = false;

document.addEventListener('DOMContentLoaded', function () {
  const containers = [
    document.getElementById('info_Container'),
    document.getElementById('instructions_Container'),
    document.getElementById('locationDiv'),
    document.getElementById('ratingDiv'),
    document.getElementById('finalDiv'),
    document.getElementById('thanksDiv'),
  ];

  // Function to show the next container
  function showNextContainer(currentIndex) {
    if (currentIndex < containers.length - 1) {
      containers[currentIndex].style.display = 'none';
      containers[currentIndex + 1].style.display = 'flex';
    }
  }

  // Function to show the previous container
  function showPreviousContainer(currentIndex) {
    if (currentIndex > 0) {
      containers[currentIndex].style.display = 'none';
      containers[currentIndex - 1].style.display = 'flex';
    }
  }

  // Initially show the first container
  containers[0].style.display = 'flex';

  document
    .getElementById('infoBtn')
    .addEventListener('click', () => showNextContainer(0));
  
  // Updated to trigger location permission
  document.getElementById('instructions_Btn').addEventListener('click', () => {
    requestLocationPermission();
    showNextContainer(1);
  });

  // Next button for locationDiv
  document.getElementById('locationBtn').addEventListener('click', () => {
    const locationInput = document.getElementById('location');
    if (locationInput.value.trim() === '') {
      alert('Please enter your location before proceeding.');
    } else {
      showNextContainer(2);
      // Hide the install button on mobile view
      if (window.innerWidth <= 600) {
        document.getElementById('installButton').style.display = 'none';
      }
    }
  });

  let ratingInteracted = false;

  document.getElementById('rating').addEventListener('input', () => {
    ratingInteracted = true;
  });

  document.getElementById('ratingBtn').addEventListener('click', () => {
    if (!ratingInteracted) {
      alert('Please move the rating slider before proceeding.');
    } else {
      showNextContainer(3);
    }
  });

  document.getElementById('nextRatingBtn').addEventListener('click', () => {
    if (!ratingInteracted) {
      alert('Please move the rating slider before proceeding.');
    } else {
      showNextContainer(3);
    }
  });

  document
    .getElementById('ratingDiv')
    .querySelector('button[type="button"]')
    .addEventListener('click', () => showPreviousContainer(3));

  initMap();
});

let map;
let marker;
let userLocation = { lat: 59.33091976142107, lng: 18.060195177256297 }; // Default location

document.addEventListener('DOMContentLoaded', function () {
  // Initialize the map
  initMap();
  document.getElementById('locationBtn').addEventListener('click', requestLocationPermission);
});

// Function to request location permission and update marker position
function requestLocationPermission() {
  const loadingIcon = document.getElementById('loadingIcon');
  
  // Show the loading icon only after the user grants location permission
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      // Success callback: If permission is granted
      (position) => {
        // Show loading icon now that we have permission
        loadingIcon.style.display = 'block';

        // Update the user location with the actual coordinates
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Move the marker to the current location
        updateMarkerPosition(userLocation);

        // Once the pin is placed, hide the loading icon
        loadingIcon.style.display = 'none';
      },
      // Error callback: If permission is denied
      () => {
        alert('Location permission denied, using default location');
        
        // Move the marker to the fallback/default location
        updateMarkerPosition(userLocation);

        // Hide the loading icon if the location is denied
        loadingIcon.style.display = 'none';
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
    updateMarkerPosition(userLocation); // Fallback to default location
    loadingIcon.style.display = 'none'; // Hide loading icon in case of failure
  }
}

// Initialize the map with default or user location
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: userLocation,
    zoom: 16,
  });

  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: userLocation,
  });

  google.maps.event.addListener(marker, 'dragend', function () {
    updateLocationInput(marker.getPosition());
  });
}

// Update the marker position on the map and the input field
function updateMarkerPosition(location) {
  marker.setPosition(location);
  map.setCenter(location);
  updateLocationInput(location); // Update the location input with new position
}

// Update the location input field with the marker's position
function updateLocationInput(latLng) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ location: latLng }, function (results, status) {
    if (status === 'OK' && results[0]) {
      document.getElementById('location').value = results[0].formatted_address;
    } else {
      console.error('Geocode was not successful: ' + status);
    }
  });
}



// Function to handle next or previous div transition
function nextDiv(currentDivId, nextDivId) {
  const currentDiv = document.getElementById(currentDivId);

  // Check if required fields are filled
  if (!validateInputs(currentDiv)) {
    alert('Please fill out all required fields before proceeding.');
    return;
  }

  currentDiv.style.display = 'none';
  document.getElementById(nextDivId).style.display = 'block';
}

// Function to validate required inputs in the current div
function validateInputs(div) {
  const inputs = div.querySelectorAll('input[required], textarea[required]');
  for (const input of inputs) {
    if (!input.value || (input.type === 'checkbox' && !input.checked)) {
      return false; 
    }
  }
  return true; 
}

// Function to handle back div transition
function backDiv(currentDivId, previousDivId) {
  document.getElementById(currentDivId).style.display = 'none';
  document.getElementById(previousDivId).style.display = 'flex';
}

document.getElementById('rating').addEventListener('input', function () {
  this.style.setProperty(
    '--value',
    ((this.value - this.min) / (this.max - this.min)) * 100 + '%'
  );
});

// Function to handle form submission
function submitForm() {
  if (!validateForm() || formSubmitted) {
    return;
  }

  // Set the flag to indicate that the form is submitted
  formSubmitted = true;

  // Gathering form data
  let location = document.getElementById('location').value;
  let rating = document.getElementById('rating').value;
  let comments = document.getElementById('comments').value;
  let email = document.getElementById('email').value;
  let contact = document.getElementById('contact').value;

  let timeOfDayCheckboxes = document.querySelectorAll(
    'input[name="timeOfDay"]:checked'
  );
  let timeOfDay = Array.from(timeOfDayCheckboxes).map((cb) => cb.value);

  let optionsCheckboxes = document.querySelectorAll(
    'input[name="options"]:checked'
  );
  let selectedOptions = Array.from(optionsCheckboxes).map((cb) => cb.value);

  // Prepare data for submission
  let data = new URLSearchParams({
    location: location,
    rating: rating,
    comments: comments,
    email: email,
    timeOfDay: timeOfDay.join(', '),
    options: selectedOptions.join(', '),
    timeStamp: new Date().toLocaleString(),
    contact: contact,
  });

  document.getElementById('finalDiv').style.display = 'none';
  document.getElementById('thanksDiv').style.display = 'flex';

  fetch(
    'https://script.google.com/macros/s/AKfycbx-jf9rbw6fhfFbhbfmbnlK3g9XBQK5bAB8fIsbls4CbNVX0p_i6zFk0ES-xQmU-sdFz/exec',
    {
      method: 'POST',
      body: data,
    }
  )
    .then(response => response.json())
    .then(data => {
      console.log('Form submitted successfully:', data);
      alert('Thank you for your submission!');
      formSubmitted = false;
    })
    .catch(error => {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again later.');
      formSubmitted = false;
    });
}
