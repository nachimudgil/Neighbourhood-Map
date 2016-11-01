var locations = [{
    query: "Hard Rock Cafe",
    lat: 17.4165,
    long: 78.4382
}, {
    query: "Hyderabad Golf Club",
    lat: 17.393629,
    long: 78.4021128
}, {
    query: "Paradise Food Court",
    lat: 17.4504898,
    long: 78.3767998
}, {
    query: "Inorbit Mall",
    lat: 17.4344863,
    long: 78.3844917
}, {
    query: "Karachi Bakery",
    lat: 17.4103133,
    long: 78.4478681
}, {
    query: "StarBucks",
    lat: 17.4503859,
    long: 78.378622
}, {
    query: "Taj Falaknuma Palace",
    lat: 17.3313295,
    long: 78.4639825
}, {
    query: "Chowmahalla Palace",
    lat: 17.3577956,
    long: 78.4694445
}, {
    query: "Prasad Imax",
    lat: 17.412992,
    long: 78.4637171
}, {
    query: "Nehru Zoological park",
    lat: 17.3456358,
    long: 78.4319536
}];
var map;
var prev_info_window = false;

function AppViewModel() {
    var self = this;
    this.locationList = ko.observableArray([]);
    locations.forEach(function(val) {
        self.locationList.push(new buildLocation(val));
    });
    this.searchTerm = ko.observable("");
    this.filteredList = ko.computed(function() {
        var filter = self.searchTerm().toLowerCase();
        if (!filter) {
            self.locationList().forEach(function(location) {
                location.visible(true);
            });
            return self.locationList();
        } else {
            return ko.utils.arrayFilter(self.locationList(), function(location) {
                var string = location.query.toLowerCase();
                var result = (string.search(filter) >= 0);
                location.visible(result);
                return result;
            });
        }
    }, self);

}
/*
 * Build the markers for the location
 */
function buildLocation(data) {
    var self = this;
    this.visible = ko.observable(true);
    this.query = data.query;
    this.marker = buildMarker(data);
    this.infoWindow = new google.maps.InfoWindow({
        content: loadContent(data, self)
    });
    this.marker.addListener('click', function() {
        loadContent(data, self);
        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.marker.setAnimation(null);
        }, 2100);
    });
    this.showMarker = ko.computed(function() {
        this.marker.setMap(this.visible() === true ? map : null);
    }, this);
    this.xyz = function(place) {
        google.maps.event.trigger(self.marker, 'click');
    };
}
/**
 *Creates the marker for the venue
 */
function buildMarker(data) {
    return new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.long),
        map: map
    });
}
/**
 * Create the info window for the marker
 */
function loadContent(data, self) {

    var clientId = "MIFQCICWFIR4SKOATQN4LKFVM2W5XH5NIQBIFQAQDKMVNRHL";
    var clientSecret = "E4WB2UMLVYBAJR2YFDEWIGWDBQFKEEUKWFLWFWXK1RGVHFRO";
    var url = "https://api.foursquare.com/v2/venues/search";
    $.getJSON(url, {
        client_id: clientId,
        client_secret: clientSecret,
        v: 20162810,
        query: data.query,
        ll: data.lat + "," +
            data.long,
        limit: 1
    }).done(function(data) {
        var venue = data.response.venues[0];
        var contentString = "<div class='info-window'>" +
            getTitle(venue.name) +
            getUrl(venue.url) +
            getFormattedAddress(venue.location.formattedAddress) +
            getPhoneNumber(venue.contact.formattedPhone) +
            "<div class='third-party'><i><strong>powered By FourSquare</strong></i></div>" +
            "</div>";
        if (prev_info_window) {
            prev_info_window.close();
        }
        prev_info_window = self.infoWindow;
        self.infoWindow.setContent(contentString);
        self.infoWindow.open(map, self.marker);
    }).fail(function(data) {
        alert("Error in loading details from foursquare.");
    });
}
/**
 * Create an HTML element with address
 */
function getFormattedAddress(formattedAddress) {
    var address = "";
    for (i = 0; i < formattedAddress.length; i++) {
        address += formattedAddress[i] + (i === formattedAddress.length - 1 ? "" : ", ");
    }
    return "<div class=address>" + address + "<//div>";
}
/**
 * Create an HTML element with title
 */
function getTitle(name) {
    return "<div class=title>" + name + "</div>";
}
/**
 * Create an HTML element with URL
 */
function getUrl(url) {
    return url !== undefined ? '<div class="content"><a href="' + url + '">' + url + "</a></div>" : "";
}
/**
 * Create an HTML element with phone number
 */
function getPhoneNumber(phoneNumber) {
    return '<div class="phone-number">' + phoneNumber + "</div>";
}

function handleError() {
    alert("Error loading google maps");
}
/**
 * initial function to start the application
 */
function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {
            lat: 17.3850,
            lng: 78.4867
        }
    });
    ko.applyBindings(new AppViewModel());
}
