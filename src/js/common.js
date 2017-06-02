$(document).ready(function () {
  $(".volume-control").click(function () {
    $('.slider-range').toggleClass("slider-range-open");
  });

  $(".navbar-toggle").click(function () {
    $('.navbar-toggle').toggleClass("navbar-toggle-open");
    $('.nav-panel').toggleClass("nav-panel-open");
  });

  //= lib/jquery-ui-init.js

  //= lib/nav-left.js

  //Generation map google

  mapGoogle = {
    init: function () {
      var $lati = $('#map-canvas').attr('data-lat'),
        $longi = $('#map-canvas').attr('data-long'),
        map = {};
      map = new google.maps.Map(document.getElementById('map-canvas'), this.mapOptions($lati, $longi));
      this.addMarker($lati, $longi, map);
    },
    addMarker: function ($lati, $longi, map) {
      var egglabs = new google.maps.LatLng($lati, $longi),
        markers = [],
        image = new google.maps.MarkerImage(
          '/wp-content/themes/locad_new/images/ico-marker.png',
          new google.maps.Size(101, 82),
          new google.maps.Point(0, 0),
          new google.maps.Point(42, 56)
        );
      markers.push(new google.maps.Marker({
        position: egglabs,
        raiseOnDrag: false,
        icon: image,
        map: map,
        draggable: false
      }));
    },
    mapOptions: function ($lati, $longi) {
      var mapCoordinates = new google.maps.LatLng($lati, $longi);
      var mapOptions = {
        zoom: 15,
        disableDefaultUI: false,
        center: mapCoordinates,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        styles: [
          {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#444444"}]
          },
          {"featureType": "landscape", "elementType": "all", "stylers": [{"color": "#f2f2f2"}]},
          {"featureType": "poi", "elementType": "all", "stylers": [{"visibility": "off"}]},
          {"featureType": "road", "elementType": "all", "stylers": [{"saturation": -100}, {"lightness": 45}]},
          {"featureType": "road.highway", "elementType": "all", "stylers": [{"visibility": "simplified"}]},
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{"visibility": "simplified"}, {"color": "#ff6a6a"}, {"lightness": "0"}]
          },
          {"featureType": "road.highway", "elementType": "labels.text", "stylers": [{"visibility": "on"}]},
          {"featureType": "road.highway", "elementType": "labels.icon", "stylers": [{"visibility": "on"}]},
          {"featureType": "road.arterial", "elementType": "all", "stylers": [{"visibility": "on"}]},
          {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#ff6a6a"}, {"lightness": "75"}]
          },
          {"featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]},
          {"featureType": "road.local", "elementType": "geometry.fill", "stylers": [{"lightness": "75"}]},
          {"featureType": "transit", "elementType": "all", "stylers": [{"visibility": "off"}]},
          {"featureType": "transit.line", "elementType": "all", "stylers": [{"visibility": "on"}]},
          {"featureType": "transit.station.bus", "elementType": "all", "stylers": [{"visibility": "on"}]},
          {"featureType": "transit.station.rail", "elementType": "all", "stylers": [{"visibility": "on"}]},
          {
            "featureType": "transit.station.rail",
            "elementType": "labels.icon",
            "stylers": [{"weight": "0.01"}, {"hue": "#ff0028"}, {"lightness": "0"}]
          },
          {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{"visibility": "on"}, {"color": "#80e4d8"}, {"lightness": "25"}, {"saturation": "-23"}]
          }
        ]
      };
      return mapOptions;
    }
  };
});

//= lib/animated-gradient.js

