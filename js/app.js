var infowindow, map, marker;

//List of all locations to be displayed on the map, JSON object containing an array of
//objects, each with name and coordinates so markers indicate their location.
var initialLocations = [{
    "name": "Sydney Opera House",
    "latLng": {lat: -33.8571965, lng: 151.2151398 }
},  
{
    "name": "Royal Botanical Gardens",
    "latLng": {lat: -33.8691798, lng: 151.2157266}
},
{
    "name": "Sydney Tower Eye",
    "latLng": {lat: -33.8707494, lng: 151.2092389}
},
{
	 "name": "Art Gallery of New South Wales",
	 "latLng": {lat: -33.8685813, lng: 151.2166793}
}, 
{  
	 "name": "Circular Quay",
	 "latLng": {lat: -33.8618579, lng: 151.2105461}
},
{
    "name": "Queen Victoria Building",
    "latLng": {lat:  -33.8717605, lng: 151.2067029}
}];

function Place(data) {
    this.name = data.name;
    this.latLng = data.latLng;  
    this.marker = ko.observable(data.marker);
}

var ViewModel = function() {
  var self = this;
  
/* Custom styles for Google Maps, displaying it in a more "cartoonish" fashion with
 * saturated colours and less outling of shapes, instead of the regular style to enhance
  * viewing experience. */
  var styles = [
    {
      "featureType": "landscape",
      "stylers": [
        {"hue": "#00FF8A"},
        {"saturation": -27.272727272727266},
        {"lightness": -16.39215686274511},
        {"gamma": 1}
      ]
    },
    {
      "featureType": "road.highway",
      "stylers": [
        {"hue": "#FF0D00"},
        {"saturation": 100},
        {"lightness": -12.721568627450978},
        {"gamma": 1}
      ]
    },
    {
      "featureType": "road.local",
      "stylers": [
        {"hue": "#FFD000"},
        {"saturation": 100},
        {"lightness": 19.84313725490196},
        {"gamma": 1}
      ]
    },
    {
      "featureType": "water",
      "stylers": [
        {"hue": "#FF0300"},
        {"saturation": -100},
        {"lightness": 148},
        {"gamma": 1}
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {"hue": "#00FF23"},
        {"saturation": -25.806451612903203},
        {"lightness": 3.3725490196078454},
        {"gamma": 1}
      ]
    }
  ];

  /* Links list view to marker when user clicks on the list element */
  self.itemClick = function(marker) {
        google.maps.event.trigger(this.marker, 'click');
  };

  /* Create a new Google Map object */
  self.googleMap = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.865143, lng: 151.209900},
    zoom: 14,
    styles: styles,    
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.LARGE,
      position: google.maps.ControlPosition.RIGHT_BOTTOM
     }
  });

  var contentString;
  /* Declare Google map info window */
  self.infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  /* Creates new Place objects for each item in initalLocations array */
  self.allLocations = [];
  initialLocations.forEach(function(place) {
    self.allLocations.push(new Place(place));
  });
  
  /* Build Google Map markers and place them onto the map */
  self.allLocations.forEach(function(place) {
    
    var markerOptions = {
      map: self.googleMap,
      position: place.latLng
    };
   
    place.marker = new google.maps.Marker(markerOptions);

     /* Foursquare API, serves as secondary AJAX feature of the map besides Google Maps API */
      var clientID = "AWOF0E4HV3H1H3BFIGE2KGZA5F2PMKF2UEU3ZL0QFZTEJPTP";
      var clientSecret = "NLOWB4Z4KOE1KVJNZ5PXIZHUVS04RSQWJ5GTLDHLZO0QMMUE";
      var foursquareURL = 'https://api.foursquare.com/v2/venues/search?limit=1&ll=' + place.latLng.lat + ','
          + place.latLng.lng + '&client_id=' + clientID + '&client_secret='+ clientSecret + '&v=20140806';
      var results, name, url, street, city;
     
      $.getJSON(foursquareURL, function(data){
        results = data.response.venues[0],
        place.name = results.name,
        place.url= results.hasOwnProperty('url') ? results.url : '';
        place.street = results.location.formattedAddress[0],
        place.city = results.location.formattedAddress[1]
  
    /* error response */
    }).fail(function() { alert("Error! Foursquare couldn't load a relevant location to your selection!");});
    
    /* Add click listener to marker and open info window */
    place.marker.addListener('click', function(){

      /* Set timeout animation */
      place.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ place.marker.setAnimation(null); }, 1400);

      //Displays when a marker is clicked on, displaying some basic info about it including name,
      //address, and the most relevant/nearest location's website using Foursquare API.
      contentString = '<h4>' + place.name + '</h4>\n<p>' + place.street + '</p>\n<p>' + place.city + '</p><a href= ' + place.url + '>' + place.url + '</a>';   
      /* Open info window and set its content */
      self.infowindow.setContent(contentString);
      self.infowindow.open(self.googleMap, place.marker);
      setTimeout(function() {self.infowindow.open(null);}, 7000);

    })
  });

  /* A observable array that will filter our list-view and markers */
  self.visibleLocations = ko.observableArray();
  
  /* Making sure all locations are visible before user input */
  self.allLocations.forEach(function(place) {
    self.visibleLocations.push(place);
  });
  
  /* Keeps track of our users input and is bound to 'textInput: userInput' in index.html*/
  self.userInput = ko.observable('');

  // filterMarkers looks at the userInput to see if it matches any characters in our locaions and markers.
  // If a string is found with a match, it is still visible while all other markers are removed 
  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();
    self.visibleLocations.removeAll();
    
   self.allLocations.forEach(function(place) {
      place.marker.setVisible(false);
      
      if (place.name.toLowerCase().indexOf(searchInput) !== -1) {
        self.visibleLocations.push(place);
      }
    });
    self.visibleLocations().forEach(function(place) {
      place.marker.setVisible(true);
    });
  };
};

//Uses knockout to display the map on the page
function myMap() { 
ko.applyBindings(new ViewModel());
}

//Error handling function in case the map doesn't load
function googleError(){
  if (typeof(google) == null){
    alert('Google maps is currently unavailable')
  }
}

