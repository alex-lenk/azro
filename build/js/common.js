$(document).ready(function () {
  $(".volume-control").click(function () {
    $('.slider-range').toggleClass("slider-range-open");
  });

  $(".navbar-toggle").click(function () {
    $('.navbar-toggle').toggleClass("navbar-toggle-open");
    $('.nav-panel').toggleClass("nav-panel-open");
  });

  $(function () {
    $(".slider-horizontal").slider({
      range: "min",
      value: 50,
      min: 1,
      max: 100,
      slide: function (event, ui) {
        $("#amount").val("$" + ui.value);
      }
    });
    $("#amount").val("$" + $("#slider-range-min").slider("value"));
  });
  
  $(function () {
    $(".slider-vertical").slider({
      orientation: "vertical",
      range: "min",
      value: 50,
      min: 0,
      max: 100,
      slide: function (event, ui) {
        $("#amount").val(ui.value);
      }
    });
    $("#amount").val($(".slider-vertical").slider("value"));
  });

  var navPos, winPos, navHeight, nav = $(".nav-left");
  
  function refreshVar() {
    navPos = nav.offset().top;
    navHeight = nav.outerHeight(true);
  }
  
  refreshVar();
  $(window).resize(refreshVar);
  
  $('<div class="clone-nav"></div>')
    .insertBefore(".nav-left")
    .css("height", navHeight)
    .hide();
  
  $(window).scroll(function () {
    winPos = $(window).scrollTop();
  
    if (winPos >= navPos) {
      nav.addClass("fixed shadow");
      $(".clone-nav").show();
    } else {
      nav.removeClass("fixed shadow");
      $(".clone-nav").hide();
    }
  });

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

var colors = new Array(
  [15, 92, 128],
  [35, 37, 37]
);

var step = 0;
//color table indices for:
// current color left
// next color left
// current color right
// next color right
var colorIndices = [0, 1, 1, 0];

//transition speed
var gradientSpeed = 0.002;

function updateGradient() {
  if ($ === undefined) return;

  var c0_0 = colors[colorIndices[0]];
  var c0_1 = colors[colorIndices[1]];
  var c1_0 = colors[colorIndices[2]];
  var c1_1 = colors[colorIndices[3]];

  var istep = 1 - step;
  var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
  var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
  var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
  var color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

  var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
  var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
  var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
  var color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

  $(".about-us-advantages-decor").css({
    background: "-webkit-gradient(linear, left top, right top, from(" +
    color1 +
    "), to(" +
    color2 +
    "))"
  }).css({
    background: "-moz-linear-gradient(left, " + "-45deg, " +
    color1 +
    " 0%, " +
    color2 +
    " 100%)"
  });

  step += gradientSpeed;
  if (step >= 1) {
    step %= 1;
    colorIndices[0] = colorIndices[1];
    colorIndices[2] = colorIndices[3];

    //pick two new target color indices
    //do not pick the same as the current one
    colorIndices[1] =
      (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) %
      colors.length;
    colorIndices[3] =
      (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) %
      colors.length;
  }
}

setInterval(updateGradient, 10);