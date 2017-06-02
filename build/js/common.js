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

var mapGoogle = {
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
        'img/fake.gif',
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
          "featureType": "all",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "all",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "saturation": 36
            },
            {
              "color": "#000000"
            },
            {
              "lightness": 40
            }
          ]
        },
        {
          "featureType": "all",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "visibility": "on"
            },
            {
              "color": "#000000"
            },
            {
              "lightness": 16
            }
          ]
        },
        {
          "featureType": "all",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 20
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 17
            },
            {
              "weight": 1.2
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#c4c4c4"
            }
          ]
        },
        {
          "featureType": "administrative.neighborhood",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#707070"
            }
          ]
        },
        {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 20
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 21
            },
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "poi.business",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#33ddfb"
            },
            {
              "lightness": "0"
            },
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "visibility": "off"
            },
            {
              "hue": "#00d9ff"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 18
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#575757"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ffffff"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#2c2c2c"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 16
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#999999"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "saturation": "-52"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 19
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            },
            {
              "lightness": 17
            }
          ]
        }
      ]
    };
    return mapOptions;
  }
};

mapGoogle.init();

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD module
    define(factory);
  } else if (typeof exports === 'object') {
    // CommonJS-like environment (i.e. Node)
    module.exports = factory();
  } else {
    // Browser global
    root.transformicons = factory();
  }
}(this || window, function () {

  // ####################
  // MODULE TRANSFORMICON
  // ####################
  'use strict';

  var
    tcon = {}, // static class
    _transformClass = 'tcon-transform',

    // const
    DEFAULT_EVENTS = {
      transform: ['click'],
      revert: ['click']
    };

  // ##############
  // private methods
  // ##############

  /**
   * Normalize a selector string, a single DOM element or an array of elements into an array of DOM elements.
   * @private
   *
   * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements
   * @returns {array} Array of DOM elements
   */
  var getElementList = function (elements) {
    if (typeof elements === 'string') {
      return Array.prototype.slice.call(document.querySelectorAll(elements));
    } else if (typeof elements === 'undefined' || elements instanceof Array) {
      return elements;
    } else {
      return [elements];
    }
  };

  /**
   * Normalize a string with eventnames separated by spaces or an array of eventnames into an array of eventnames.
   * @private
   *
   * @param {(string|array)} elements - String with eventnames separated by spaces or array of eventnames
   * @returns {array} Array of eventnames
   */
  var getEventList = function (events) {
    if (typeof events === 'string') {
      return events.toLowerCase().split(' ');
    } else {
      return events;
    }
  };

  /**
   * Attach or remove transformicon events to one or more elements.
   * @private
   *
   * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be toggled
   * @param {object} [events] - An Object containing one or more special event definitions
   * @param {boolean} [remove=false] - Defines wether the listeners should be added (default) or removed.
   */
  var setListeners = function (elements, events, remove) {
    var
      method = (remove ? 'remove' : 'add') + 'EventListener',
      elementList = getElementList(elements),
      currentElement = elementList.length,
      eventLists = {};

    // get events or use defaults
    for (var prop in DEFAULT_EVENTS) {
      eventLists[prop] = (events && events[prop]) ? getEventList(events[prop]) : DEFAULT_EVENTS[prop];
    }

    // add or remove all events for all occasions to all elements
    while (currentElement--) {
      for (var occasion in eventLists) {
        var currentEvent = eventLists[occasion].length;
        while (currentEvent--) {
          elementList[currentElement][method](eventLists[occasion][currentEvent], handleEvent);
        }
      }
    }
  };

  /**
   * Event handler for transform events.
   * @private
   *
   * @param {object} event - event object
   */
  var handleEvent = function (event) {
    tcon.toggle(event.currentTarget);
  };

  // ##############
  // public methods
  // ##############

  /**
   * Add transformicon behavior to one or more elements.
   * @public
   *
   * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be toggled
   * @param {object} [events] - An Object containing one or more special event definitions
   * @param {(string|array)} [events.transform] - One or more events that trigger the transform. Can be an Array or string with events seperated by space.
   * @param {(string|array)} [events.revert] - One or more events that trigger the reversion. Can be an Array or string with events seperated by space.
   * @returns {transformicon} transformicon instance for chaining
   */
  tcon.add = function (elements, events) {
    setListeners(elements, events);
    return tcon;
  };

  /**
   * Remove transformicon behavior from one or more elements.
   * @public
   *
   * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be toggled
   * @param {object} [events] - An Object containing one or more special event definitions
   * @param {(string|array)} [events.transform] - One or more events that trigger the transform. Can be an Array or string with events seperated by space.
   * @param {(string|array)} [events.revert] - One or more events that trigger the reversion. Can be an Array or string with events seperated by space.
   * @returns {transformicon} transformicon instance for chaining
   */
  tcon.remove = function (elements, events) {
    setListeners(elements, events, true);
    return tcon;
  };

  /**
   * Put one or more elements in the transformed state.
   * @public
   *
   * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be transformed
   * @returns {transformicon} transformicon instance for chaining
   */
  tcon.transform = function (elements) {
    getElementList(elements).forEach(function (element) {
      element.classList.add(_transformClass);
    });
    return tcon;
  };

  /**
   * Revert one or more elements to the original state.
   * @public
   *
   * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be reverted
   * @returns {transformicon} transformicon instance for chaining
   */
  tcon.revert = function (elements) {
    getElementList(elements).forEach(function (element) {
      element.classList.remove(_transformClass);
    });
    return tcon;
  };

  /**
   * Toggles one or more elements between transformed and original state.
   * @public
   *
   * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be toggled
   * @returns {transformicon} transformicon instance for chaining
   */
  tcon.toggle = function (elements) {
    getElementList(elements).forEach(function (element) {
      tcon[element.classList.contains(_transformClass) ? 'revert' : 'transform'](element);
    });
    return tcon;
  };

  return tcon;
}));

transformicons.add('.tcon');