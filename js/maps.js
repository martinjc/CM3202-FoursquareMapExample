(function(){

    var map = L.map('map');

    function initmap() {
        var tileURL = 'http://{s}.tile.cloudmade.com/882045d6a85f47d99d088ac83803d3f1/997/256/{z}/{x}/{y}.png';
        var attribString = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>';
        var tileLayer = new L.tileLayer(tileURL, {
            attribution: attribString,
            minZoom: 8,
            maxZoom: 18
        });

        map.addLayer(tileLayer);
        map.locate({setView: true, maxZoom: 16});
    }

    initmap();
})();