$(document).ready(function () {
  $(".volume-control").click(function () {
    $('.slider-range').toggleClass("slider-range-open");
  });

  $(".navbar-toggle").click(function () {
    $('.nav-panel').toggleClass("nav-panel-open");
  });

  var formControl = $(".form-control"),
    formGroup = ".form-group",
    formGroupFocus = "form-group-focus";

  formControl.focus(function () {
    $(this).closest(formGroup).addClass(formGroupFocus);
  });
  formControl.blur(function () {
    $(this).closest(formGroup).removeClass(formGroupFocus);
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
  
  //$('<div class="clone-nav"></div>').insertBefore(".nav-left").css("height", navHeight).hide();
  
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

  $('#fullpage').fullpage({
    hybrid:true,
    fitToSection: false
  });
});

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
 * demo1.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2017, Codrops
 * http://www.codrops.com
 */
{
	// Helper vars and functions.
	const extend = function(a, b) {
		for( let key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	};

	// from http://www.quirksmode.org/js/events_properties.html#position
	const getMousePos = function(ev) {
		let posx = 0;
		let posy = 0;
		if (!ev) ev = window.event;
		if (ev.pageX || ev.pageY) 	{
			posx = ev.pageX;
			posy = ev.pageY;
		}
		else if (ev.clientX || ev.clientY) 	{
			posx = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return { x : posx, y : posy };
	};

	const TiltObj = function(el, options) {
		this.el = el;
		this.options = extend({}, this.options);
		extend(this.options, options);
		this.DOM = {};
		this.DOM.img = this.el.querySelector('.project-parallax-img');
		this.DOM.title = this.el.querySelector('.project-parallax-decor');
		this._initEvents();
	};

	TiltObj.prototype.options = {
		movement: {
			img : { translation : {x: -10, y: -10} },
			title : { translation : {x: 25, y: 25} },
		}
	};

	TiltObj.prototype._initEvents = function() {
		this.mouseenterFn = (ev) => {
			anime.remove(this.DOM.img);
			anime.remove(this.DOM.title);
		};

		this.mousemoveFn = (ev) => {
			requestAnimationFrame(() => this._layout(ev));
		};

		this.mouseleaveFn = (ev) => {
			requestAnimationFrame(() => {
				anime({
					targets: [this.DOM.img, this.DOM.title],
					duration: 1500,
					easing: 'easeOutElastic',
					elasticity: 400,
					translateX: 0,
					translateY: 0
				});
			});
		};

		this.el.addEventListener('mousemove', this.mousemoveFn);
		this.el.addEventListener('mouseleave', this.mouseleaveFn);
		this.el.addEventListener('mouseenter', this.mouseenterFn);
	};

	TiltObj.prototype._layout = function(ev) {
		// Mouse position relative to the document.
		const mousepos = getMousePos(ev);
		// Document scrolls.
		const docScrolls = {left : document.body.scrollLeft + document.documentElement.scrollLeft, top : document.body.scrollTop + document.documentElement.scrollTop};
		const bounds = this.el.getBoundingClientRect();
		// Mouse position relative to the main element (this.DOM.el).
		const relmousepos = { x : mousepos.x - bounds.left - docScrolls.left, y : mousepos.y - bounds.top - docScrolls.top };

		// Movement settings for the animatable elements.
		const t = {
			img: this.options.movement.img.translation,
			title: this.options.movement.title.translation,
		};

		const transforms = {
			img : {
				x: (-1*t.img.x - t.img.x)/bounds.width*relmousepos.x + t.img.x,
				y: (-1*t.img.y - t.img.y)/bounds.height*relmousepos.y + t.img.y
			},
			title : {
				x: (-1*t.title.x - t.title.x)/bounds.width*relmousepos.x + t.title.x,
				y: (-1*t.title.y - t.title.y)/bounds.height*relmousepos.y + t.title.y
			}
		};
		this.DOM.img.style.WebkitTransform = this.DOM.img.style.transform = 'translateX(' + transforms.img.x + 'px) translateY(' + transforms.img.y + 'px)';
		this.DOM.title.style.WebkitTransform = this.DOM.title.style.transform = 'translateX(' + transforms.title.x + 'px) translateY(' + transforms.title.y + 'px)';
	};

	const DOM = {};
	DOM.svg = document.querySelector('.morph');
	DOM.contentElems = Array.from(document.querySelectorAll('.project-parallax'));
	DOM.contentLinks = Array.from(document.querySelectorAll('.content__link'));
	const contentElemsTotal = DOM.contentElems.length;
	const shapes = [
		// footer shape:
		{
			path: 'M 262.9,252.2 C 210.1,338.2 212.6,487.6 288.8,553.9 372.2,626.5 511.2,517.8 620.3,536.3 750.6,558.4 860.3,723 987.3,686.5 1089,657.3 1168,534.7 1173,429.2 1178,313.7 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
			pathAlt: 'M 262.9,252.2 C 210.1,338.2 273.3,400.5 298.5,520 323.7,639.6 511.2,537.2 620.3,555.7 750.6,577.8 872.2,707.4 987.3,686.5 1102,665.6 1218,547.8 1173,429.2 1128,310.6 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
			scaleX: 2.5,
			scaleY: 2,
			rotate: 0,
			tx: 0,
			ty: -50,
			fill: {
				color: '#282faf',
				duration: 500,
				easing: 'linear'
			},
			animation: {
				path: {
					duration: 3000,
					easing: 'easeOutQuad',
					elasticity: 600
				},
				svg: {
					duration: 3000,
					easing: 'easeOutElastic'
				}
			}
		}
	];
	let step;

	const initShapeLoop = function(pos) {
		pos = pos || 0;
		anime.remove(DOM.shapeEl);
		anime({
			targets: DOM.shapeEl,
			easing: 'linear',
			loop: true,
			fill: {
				value: shapes[pos].fill.color,
				duration: shapes[pos].fill.duration,
				easing: shapes[pos].fill.easing
			},
			direction: 'alternate'
		});
	};

	const initShapeEl = function() {
		anime.remove(DOM.svg);
		anime({
			targets: DOM.svg,
			duration: 1,
			easing: 'linear',
			scaleX: shapes[0].scaleX,
			scaleY: shapes[0].scaleY,
			translateX: shapes[0].tx+'px',
			translateY: shapes[0].ty+'px',
			rotate: shapes[0].rotate+'deg'
		});

		initShapeLoop();
	};

	const init = function() {
		imagesLoaded(document.body, () => {
			initShapeEl();
			Array.from(document.querySelectorAll('.project-parallax-layout')).forEach(el => new TiltObj(el));
		});
	}

	init();
};