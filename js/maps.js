(function(){

    var map = L.map('map');

    var venue_ids = [];
    var venues = [];

    var rec_venue_ids = [];
    var rec_venues = [];

    // http://stackoverflow.com/questions/1403888/get-url-parameter-with-jquery
    function getURLParameter(name, location) {
        return decodeURIComponent((new RegExp('[?|&|#]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location)||[,""])[1].replace(/\+/g, '%20'))||null;
    }

    function doAuth() {
        auth = getURLParameter('access_token', window.location.hash);
        console.log(auth);
        if(auth !== null) {
            localStorage.foursquareauth = auth;
        }
    }

    function hideShowMarkers() {
        $.each(venues, function(i, venue) {
            if(map.getBounds().contains(venue.getLatLng())) {
                map.addLayer(venue);
            } else {
                map.removeLayer(venue);
            }
        });
        $.each(rec_venues, function(i, venue) {
            if(map.getBounds().contains(venue.getLatLng())) {
                map.addLayer(venue);
            } else {
                map.removeLayer(venue);
            }
        });
    }

    function addRecommendedVenue(venue) {
        if(rec_venue_ids.indexOf(venue.id) <= -1) {
            var myIcon = L.icon({
                iconUrl: 'img/beer_rec.png',
                iconSize: [48,48],
                popupAnchor: [0, -24]
            });
            var marker = new L.marker([venue.venue.location.lat, venue.venue.location.lng], {
                title: venue.venue.name,
                icon: myIcon,
                xIndexOffset: 1000
            });
            var popupstr = "";
            popupstr += "<img style='float:left; padding:4px' src='img/foursquare_icon.png' /><h1>" + venue.venue.name + "</h1>";
            marker.bindPopup(popupstr);
            rec_venue_ids.push(venue.venue.id);
            rec_venues.push(marker);            
        }
    }

    function addVenue(venue) {
        if (venue_ids.indexOf(venue.id) <= -1) {
            var myIcon = L.icon({
                iconUrl: 'img/beer.png',
                iconSize: [32,32],
                popupAnchor: [0, -16]
            });
            var marker = new L.marker([venue.location.lat, venue.location.lng], {
                title: venue.name,
                icon: myIcon
            });
            var popupstr = "";
            popupstr += "<img style='float:left; padding:4px' src='img/foursquare_icon.png' /><h1>" + venue.name + "</h1>";
            marker.bindPopup(popupstr);
            venue_ids.push(venue.id);
            venues.push(marker);       
        }

    }

    function onMoveEnd() {
        var centre = map.getCenter();
        var ll = centre.lat + "," + centre.lng;

        $.getJSON("https://api.foursquare.com/v2/venues/search", {
            ll: ll,
            radius: 500,
            intent: "browse",
            categoryId: "4d4b7105d754a06376d81259",
            client_id: "YOUR_FOURSQUARE_CLIENT_ID",
            client_secret: "YOUR_FOURSQUARE_CLIENT_SECRET",
            v: 20140218
        }).done(function(data){
            $.each(data.response.venues, function(i, venue) {
                //console.log(venue);
                addVenue(venue);
            });
            hideShowMarkers();
        });
        if(localStorage.foursquareauth) {
            $.getJSON("https://api.foursquare.com/v2/venues/explore", {
                ll: ll,
                radius: 500,
                section: 'drinks',
                limit: 50,
                oauth_token: localStorage.foursquareauth,
                v: 20140218 
            }).done(function(data){
                $.each(data.response.groups, function(i, group){
                    $.each(group.items, function(j, item) {
                        //console.log(item);
                        addRecommendedVenue(item);
                    });
                });
                hideShowMarkers();
            });
        }
    }


    function initmap() {
        var tileURL = 'http://{s}.tile.cloudmade.com/YOUR_CLOUDMADE_API_KEY/997/256/{z}/{x}/{y}.png';
        var attribString = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>';
        var tileLayer = new L.tileLayer(tileURL, {
            attribution: attribString,
            minZoom: 8,
            maxZoom: 18
        });

        map.addLayer(tileLayer);
        map.locate({setView: true, maxZoom: 16});

        map.on('moveend', onMoveEnd);

        doAuth();
    }

    initmap();
})();