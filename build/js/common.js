$(document).ready(function () {

  var navPanel = $('.nav-panel');

  $(".nav-left_toggle").click(function () {
    navPanel.toggleClass("nav-panel-open");
  });

  $(".hire-us-open,.modal-close").click(function () {
    $('.modal-top').toggleClass("modal-top-opened");
  });

  $(".hire-us-left-open,.modal-back").click(function () {
    navPanel.toggleClass("modal-left-opened");
  });

  /**
   *
   * BEGIN focus form-control
   *
   */

  var formControl = $(".form-control"),
    formGroup = ".form-group",
    formGroupFocus = "form-group-focus";

  formControl.focus(function () {
    $(this).closest(formGroup).addClass(formGroupFocus);
  });

  formControl.blur(function () {
    $(this).closest(formGroup).removeClass(formGroupFocus);
  });

  /**
   *
   * END focus form-control
   *
   */


  // BEGIN: Для ошибок форм
  $(".form-control").change(function () {
    if ($(this).val().trim().length) {
      $(this).parent().addClass("field-filled");
    } else {
      $(this).parent().removeClass("field-filled");
    }
  });
  //END
});


/**
 *
 * BEGIN volume-control
 *
 * Created on 03.07.17.
 *
 */

// = init/volume-control

/**
 *
 * END volume-control
 *
 */



/**
 *
 * BEGIN full-page-control by Oleg tviggyr
 *
 */

/**
 * Created by newuser on 03.07.17.
 */
(function ($) {
  var section = 1;
  var noscrol = false;
  var startEl = $('.home-header'),
    ourMission = $('.our-mission'),
    ourWork = $('.our-work');


  $('html,body').on('wheel', function (event) {

    WinTop = $(window).scrollTop();
    console.log(WinTop);
    console.log(section);

    if (WinTop < 50) {
      if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
        scrollHome('top', 0);
      }
      else {
        scrollHome('bottom', 0);
      }
    }
  });


  function scrollHome(direction, WinTop) {

    if (section == 3) {
      noscrol = false;
    }

    if (!noscrol && WinTop == 0) {

      noscrol = true;

      if (direction == 'bottom') {
        if (section == 1) {
          section = 2;
          startEl.addClass('header-out');
          ourMission.addClass('second-active block-out');

        }
        else if (section == 2) {
          section = 3;
        }


      }
      else if (direction == 'top') {


        if (section == 3) {
          section = 2;

          ourWork.removeClass('active-work');
          ourMission.addClass('second-active');
        }
        else if (section == 2) {
          section = 1;
          startEl.removeClass('header-out');
          ourMission.removeClass('block-out');
          ourMission.removeClass('second-active');

        } else if (section == 1) {
          ourMission.removeClass('second-active');

        }
      }

      if (section == 3) {
        ourMission.removeClass('second-active');
        ourWork.addClass('active-work');
        setTimeout(function () {
          setTimeout(function () {
            // videoshow();
          }, 1000);

          $('html').removeClass('no-scroll');

        }, 1000);
      }
      else {
        $('html').addClass('no-scroll');
      }

      setTimeout(function () {
        noscrol = false;
      }, 1000);
    }
  }


})(jQuery);

/**
 *
 * END full-page-control
 *
 */

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

transformicons.add('.nav-left_toggle');

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


/**
 *
 * BEGIN parallax effect
 *
 *
 */

var rentPro = document.getElementById('rentPro'),
  rentPro2 = document.getElementById('rentPro2'),
  karma = document.getElementById('karma'),
  karma2 = document.getElementById('karma2'),
  gazmodel = document.getElementById('gazmodel'),
  gazmodel2 = document.getElementById('gazmodel2'),
  locad = document.getElementById('locad'),
  locad2 = document.getElementById('locad2'),

  parallax = new Parallax(rentPro),
  parallax = new Parallax(rentPro2),
  parallax = new Parallax(karma),
  parallax = new Parallax(karma2),
  parallax = new Parallax(gazmodel),
  parallax = new Parallax(gazmodel2),
  parallax = new Parallax(locad),
  parallax = new Parallax(locad2);

/**
 *
 * END To parallax effect
 *
 */

var mainNav = $(".our-mission"),
  mainNavFixed = 'main-nav-fixed',
  $window = $(window),
  $h2 = mainNav.offset().top;// Определяем координаты верха блока навигации

$window.scroll(function () {
  // Если прокрутили скролл ниже макушки блока, включаем фиксацию
  if ($window.scrollTop() > $h2) {
    mainNav.addClass(mainNavFixed);
  } else {
    //Иначе возвращаем всё назад
    mainNav.removeClass(mainNavFixed);
  }
});