/**
 * Created by spring on 22.03.2017.
 */
/*!
 * @copyright Copyright (c) 2017 IcoMoon.io
 * @license   Licensed under MIT license
 *            See https://github.com/Keyamoon/svgxuse
 * @version   1.2.3
 */
(function(){if("undefined"!=typeof window&&window.addEventListener){var e=Object.create(null),m,t,d=function(){clearTimeout(t);t=setTimeout(m,100)},q=function(){},u=function(){var f;window.addEventListener("resize",d,!1);window.addEventListener("orientationchange",d,!1);window.MutationObserver?(f=new MutationObserver(d),f.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0}),q=function(){try{f.disconnect(),window.removeEventListener("resize",d,!1),window.removeEventListener("orientationchange",d,
        !1)}catch(n){}}):(document.documentElement.addEventListener("DOMSubtreeModified",d,!1),q=function(){document.documentElement.removeEventListener("DOMSubtreeModified",d,!1);window.removeEventListener("resize",d,!1);window.removeEventListener("orientationchange",d,!1)})},v=function(f){function e(a){var c;void 0!==a.protocol?c=a:(c=document.createElement("a"),c.href=a);return c.protocol.replace(/:/g,"")+c.host}var d,p;window.XMLHttpRequest&&(d=new XMLHttpRequest,p=e(location),f=e(f),d=void 0===d.withCredentials&&
""!==f&&f!==p?XDomainRequest||void 0:XMLHttpRequest);return d};m=function(){function d(){--r;0===r&&(q(),u())}function n(a){return function(){!0!==e[a.base]&&(a.isXlink?a.useEl.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href","#"+a.hash):a.useEl.setAttribute("href","#"+a.hash))}}function m(a){return function(){var c=document.body,b=document.createElement("x");a.onload=null;b.innerHTML=a.responseText;if(b=b.getElementsByTagName("svg")[0])b.setAttribute("aria-hidden","true"),b.style.position=
    "absolute",b.style.width=0,b.style.height=0,b.style.overflow="hidden",c.insertBefore(b,c.firstChild);d()}}function p(a){return function(){a.onerror=null;a.ontimeout=null;d()}}var a,c,l,g,r=0,b,k=!1,h;q();h=document.getElementsByTagName("use");for(g=0;g<h.length;g+=1){try{c=h[g].getBoundingClientRect()}catch(w){c=!1}(a=h[g].getAttribute("href"))?k=!1:(a=h[g].getAttributeNS("http://www.w3.org/1999/xlink","href"),k=!0);l=a&&a.split?a.split("#"):["",""];a=l[0];l=l[1];b=c&&0===c.left&&0===c.right&&0===
    c.top&&0===c.bottom;c&&0===c.width&&0===c.height&&!b?a.length&&(b=e[a],!0!==b&&setTimeout(n({useEl:h[g],base:a,hash:l,isXlink:k}),0),void 0===b&&(k=v(a),void 0!==k&&(b=new k,e[a]=b,b.onload=m(b),b.onerror=p(b),b.ontimeout=p(b),b.open("GET",a),b.send(),r+=1))):b?a.length&&e[a]&&setTimeout(n({useEl:h[g],base:a,hash:l,isXlink:k}),0):void 0===e[a]?e[a]=!0:e[a].onload&&(e[a].abort(),delete e[a].onload,e[a]=!0)}h="";r+=1;d()};window.addEventListener("load",function n(){window.removeEventListener("load",
    n,!1);t=setTimeout(m,0)},!1)}})();

//
// SmoothScroll for websites v1.4.6 (Balazs Galambosi)
// http://www.smoothscroll.net/
//
// Licensed under the terms of the MIT license.
//
// You may use it in your theme if you credit me.
// It is also free to use on any individual website.
//
// Exception:
// The only restriction is to not publish any
// extension for browsers or native application
// without getting a written permission first.
//

(function () {

// Scroll Variables (tweakable)
    var defaultOptions = {

        // Scrolling Core
        frameRate        : 150, // [Hz]
        animationTime    : 400, // [ms]
        stepSize         : 100, // [px]

        // Pulse (less tweakable)
        // ratio of "tail" to "acceleration"
        pulseAlgorithm   : true,
        pulseScale       : 4,
        pulseNormalize   : 1,

        // Acceleration
        accelerationDelta : 50,  // 50
        accelerationMax   : 3,   // 3

        // Keyboard Settings
        keyboardSupport   : true,  // option
        arrowScroll       : 50,    // [px]

        // Other
        fixedBackground   : true,
        excluded          : ''
    };

    var options = defaultOptions;


// Other Variables
    var isExcluded = false;
    var isFrame = false;
    var direction = { x: 0, y: 0 };
    var initDone  = false;
    var root = document.documentElement;
    var activeElement;
    var observer;
    var refreshSize;
    var deltaBuffer = [];
    var isMac = /^Mac/.test(navigator.platform);

    var key = { left: 37, up: 38, right: 39, down: 40, spacebar: 32,
        pageup: 33, pagedown: 34, end: 35, home: 36 };
    var arrowKeys = { 37: 1, 38: 1, 39: 1, 40: 1 };

    /***********************************************
     * INITIALIZE
     ***********************************************/

    /**
     * Tests if smooth scrolling is allowed. Shuts down everything if not.
     */
    function initTest() {
        if (options.keyboardSupport) {
            addEvent('keydown', keydown);
        }
    }

    /**
     * Sets up scrolls array, determines if frames are involved.
     */
    function init() {

        if (initDone || !document.body) return;

        initDone = true;

        var body = document.body;
        var html = document.documentElement;
        var windowHeight = window.innerHeight;
        var scrollHeight = body.scrollHeight;

        // check compat mode for root element
        root = (document.compatMode.indexOf('CSS') >= 0) ? html : body;
        activeElement = body;

        initTest();

        // Checks if this script is running in a frame
        if (top != self) {
            isFrame = true;
        }

        /**
         * Safari 10 fixed it, Chrome fixed it in v45:
         * This fixes a bug where the areas left and right to
         * the content does not trigger the onmousewheel event
         * on some pages. e.g.: html, body { height: 100% }
         */
        else if (isOldSafari &&
            scrollHeight > windowHeight &&
            (body.offsetHeight <= windowHeight ||
            html.offsetHeight <= windowHeight)) {

            var fullPageElem = document.createElement('div');
            fullPageElem.style.cssText = 'position:absolute; z-index:-10000; ' +
                'top:0; left:0; right:0; height:' +
                root.scrollHeight + 'px';
            document.body.appendChild(fullPageElem);

            // DOM changed (throttled) to fix height
            var pendingRefresh;
            refreshSize = function () {
                if (pendingRefresh) return; // could also be: clearTimeout(pendingRefresh);
                pendingRefresh = setTimeout(function () {
                    if (isExcluded) return; // could be running after cleanup
                    fullPageElem.style.height = '0';
                    fullPageElem.style.height = root.scrollHeight + 'px';
                    pendingRefresh = null;
                }, 500); // act rarely to stay fast
            };

            setTimeout(refreshSize, 10);

            addEvent('resize', refreshSize);

            // TODO: attributeFilter?
            var config = {
                attributes: true,
                childList: true,
                characterData: false
                // subtree: true
            };

            observer = new MutationObserver(refreshSize);
            observer.observe(body, config);

            if (root.offsetHeight <= windowHeight) {
                var clearfix = document.createElement('div');
                clearfix.style.clear = 'both';
                body.appendChild(clearfix);
            }
        }

        // disable fixed background
        if (!options.fixedBackground && !isExcluded) {
            body.style.backgroundAttachment = 'scroll';
            html.style.backgroundAttachment = 'scroll';
        }
    }

    /**
     * Removes event listeners and other traces left on the page.
     */
    function cleanup() {
        observer && observer.disconnect();
        removeEvent(wheelEvent, wheel);
        removeEvent('mousedown', mousedown);
        removeEvent('keydown', keydown);
        removeEvent('resize', refreshSize);
        removeEvent('load', init);
    }


    /************************************************
     * SCROLLING
     ************************************************/

    var que = [];
    var pending = false;
    var lastScroll = Date.now();

    /**
     * Pushes scroll actions to the scrolling queue.
     */
    function scrollArray(elem, left, top) {

        directionCheck(left, top);

        if (options.accelerationMax != 1) {
            var now = Date.now();
            var elapsed = now - lastScroll;
            if (elapsed < options.accelerationDelta) {
                var factor = (1 + (50 / elapsed)) / 2;
                if (factor > 1) {
                    factor = Math.min(factor, options.accelerationMax);
                    left *= factor;
                    top  *= factor;
                }
            }
            lastScroll = Date.now();
        }

        // push a scroll command
        que.push({
            x: left,
            y: top,
            lastX: (left < 0) ? 0.99 : -0.99,
            lastY: (top  < 0) ? 0.99 : -0.99,
            start: Date.now()
        });

        // don't act if there's a pending queue
        if (pending) {
            return;
        }

        var scrollWindow = (elem === document.body);

        var step = function (time) {

            var now = Date.now();
            var scrollX = 0;
            var scrollY = 0;

            for (var i = 0; i < que.length; i++) {

                var item = que[i];
                var elapsed  = now - item.start;
                var finished = (elapsed >= options.animationTime);

                // scroll position: [0, 1]
                var position = (finished) ? 1 : elapsed / options.animationTime;

                // easing [optional]
                if (options.pulseAlgorithm) {
                    position = pulse(position);
                }

                // only need the difference
                var x = (item.x * position - item.lastX) >> 0;
                var y = (item.y * position - item.lastY) >> 0;

                // add this to the total scrolling
                scrollX += x;
                scrollY += y;

                // update last values
                item.lastX += x;
                item.lastY += y;

                // delete and step back if it's over
                if (finished) {
                    que.splice(i, 1); i--;
                }
            }

            // scroll left and top
            if (scrollWindow) {
                window.scrollBy(scrollX, scrollY);
            }
            else {
                if (scrollX) elem.scrollLeft += scrollX;
                if (scrollY) elem.scrollTop  += scrollY;
            }

            // clean up if there's nothing left to do
            if (!left && !top) {
                que = [];
            }

            if (que.length) {
                requestFrame(step, elem, (1000 / options.frameRate + 1));
            } else {
                pending = false;
            }
        };

        // start a new queue of actions
        requestFrame(step, elem, 0);
        pending = true;
    }


    /***********************************************
     * EVENTS
     ***********************************************/

    /**
     * Mouse wheel handler.
     * @param {Object} event
     */
    function wheel(event) {

        if (!initDone) {
            init();
        }

        var target = event.target;

        // leave early if default action is prevented
        // or it's a zooming event with CTRL
        if (event.defaultPrevented || event.ctrlKey) {
            return true;
        }

        // leave embedded content alone (flash & pdf)
        if (isNodeName(activeElement, 'embed') ||
            (isNodeName(target, 'embed') && /\.pdf/i.test(target.src)) ||
            isNodeName(activeElement, 'object') ||
            target.shadowRoot) {
            return true;
        }

        var deltaX = -event.wheelDeltaX || event.deltaX || 0;
        var deltaY = -event.wheelDeltaY || event.deltaY || 0;

        if (isMac) {
            if (event.wheelDeltaX && isDivisible(event.wheelDeltaX, 120)) {
                deltaX = -120 * (event.wheelDeltaX / Math.abs(event.wheelDeltaX));
            }
            if (event.wheelDeltaY && isDivisible(event.wheelDeltaY, 120)) {
                deltaY = -120 * (event.wheelDeltaY / Math.abs(event.wheelDeltaY));
            }
        }

        // use wheelDelta if deltaX/Y is not available
        if (!deltaX && !deltaY) {
            deltaY = -event.wheelDelta || 0;
        }

        // line based scrolling (Firefox mostly)
        if (event.deltaMode === 1) {
            deltaX *= 40;
            deltaY *= 40;
        }

        var overflowing = overflowingAncestor(target);

        // nothing to do if there's no element that's scrollable
        if (!overflowing) {
            // except Chrome iframes seem to eat wheel events, which we need to
            // propagate up, if the iframe has nothing overflowing to scroll
            if (isFrame && isChrome)  {
                // change target to iframe element itself for the parent frame
                Object.defineProperty(event, "target", {value: window.frameElement});
                return parent.wheel(event);
            }
            return true;
        }

        // check if it's a touchpad scroll that should be ignored
        if (isTouchpad(deltaY)) {
            return true;
        }

        // scale by step size
        // delta is 120 most of the time
        // synaptics seems to send 1 sometimes
        if (Math.abs(deltaX) > 1.2) {
            deltaX *= options.stepSize / 120;
        }
        if (Math.abs(deltaY) > 1.2) {
            deltaY *= options.stepSize / 120;
        }

        scrollArray(overflowing, deltaX, deltaY);
        event.preventDefault();
        scheduleClearCache();
    }

    /**
     * Keydown event handler.
     * @param {Object} event
     */
    function keydown(event) {

        var target   = event.target;
        var modifier = event.ctrlKey || event.altKey || event.metaKey ||
            (event.shiftKey && event.keyCode !== key.spacebar);

        // our own tracked active element could've been removed from the DOM
        if (!document.body.contains(activeElement)) {
            activeElement = document.activeElement;
        }

        // do nothing if user is editing text
        // or using a modifier key (except shift)
        // or in a dropdown
        // or inside interactive elements
        var inputNodeNames = /^(textarea|select|embed|object)$/i;
        var buttonTypes = /^(button|submit|radio|checkbox|file|color|image)$/i;
        if ( event.defaultPrevented ||
            inputNodeNames.test(target.nodeName) ||
            isNodeName(target, 'input') && !buttonTypes.test(target.type) ||
            isNodeName(activeElement, 'video') ||
            isInsideYoutubeVideo(event) ||
            target.isContentEditable ||
            modifier ) {
            return true;
        }

        // [spacebar] should trigger button press, leave it alone
        if ((isNodeName(target, 'button') ||
            isNodeName(target, 'input') && buttonTypes.test(target.type)) &&
            event.keyCode === key.spacebar) {
            return true;
        }

        // [arrwow keys] on radio buttons should be left alone
        if (isNodeName(target, 'input') && target.type == 'radio' &&
            arrowKeys[event.keyCode])  {
            return true;
        }

        var shift, x = 0, y = 0;
        var overflowing = overflowingAncestor(activeElement);

        if (!overflowing) {
            // Chrome iframes seem to eat key events, which we need to
            // propagate up, if the iframe has nothing overflowing to scroll
            return (isFrame && isChrome) ? parent.keydown(event) : true;
        }

        var clientHeight = overflowing.clientHeight;

        if (overflowing == document.body) {
            clientHeight = window.innerHeight;
        }

        switch (event.keyCode) {
            case key.up:
                y = -options.arrowScroll;
                break;
            case key.down:
                y = options.arrowScroll;
                break;
            case key.spacebar: // (+ shift)
                shift = event.shiftKey ? 1 : -1;
                y = -shift * clientHeight * 0.9;
                break;
            case key.pageup:
                y = -clientHeight * 0.9;
                break;
            case key.pagedown:
                y = clientHeight * 0.9;
                break;
            case key.home:
                y = -overflowing.scrollTop;
                break;
            case key.end:
                var scroll = overflowing.scrollHeight - overflowing.scrollTop;
                var scrollRemaining = scroll - clientHeight;
                y = (scrollRemaining > 0) ? scrollRemaining + 10 : 0;
                break;
            case key.left:
                x = -options.arrowScroll;
                break;
            case key.right:
                x = options.arrowScroll;
                break;
            default:
                return true; // a key we don't care about
        }

        scrollArray(overflowing, x, y);
        event.preventDefault();
        scheduleClearCache();
    }

    /**
     * Mousedown event only for updating activeElement
     */
    function mousedown(event) {
        activeElement = event.target;
    }


    /***********************************************
     * OVERFLOW
     ***********************************************/

    var uniqueID = (function () {
        var i = 0;
        return function (el) {
            return el.uniqueID || (el.uniqueID = i++);
        };
    })();

    var cache = {}; // cleared out after a scrolling session
    var clearCacheTimer;

//setInterval(function () { cache = {}; }, 10 * 1000);

    function scheduleClearCache() {
        clearTimeout(clearCacheTimer);
        clearCacheTimer = setInterval(function () { cache = {}; }, 1*1000);
    }

    function setCache(elems, overflowing) {
        for (var i = elems.length; i--;)
            cache[uniqueID(elems[i])] = overflowing;
        return overflowing;
    }

//  (body)                (root)
//         | hidden | visible | scroll |  auto  |
// hidden  |   no   |    no   |   YES  |   YES  |
// visible |   no   |   YES   |   YES  |   YES  |
// scroll  |   no   |   YES   |   YES  |   YES  |
// auto    |   no   |   YES   |   YES  |   YES  |

    function overflowingAncestor(el) {
        var elems = [];
        var body = document.body;
        var rootScrollHeight = root.scrollHeight;
        do {
            var cached = cache[uniqueID(el)];
            if (cached) {
                return setCache(elems, cached);
            }
            elems.push(el);
            if (rootScrollHeight === el.scrollHeight) {
                var topOverflowsNotHidden = overflowNotHidden(root) && overflowNotHidden(body);
                var isOverflowCSS = topOverflowsNotHidden || overflowAutoOrScroll(root);
                if (isFrame && isContentOverflowing(root) ||
                    !isFrame && isOverflowCSS) {
                    return setCache(elems, getScrollRoot());
                }
            } else if (isContentOverflowing(el) && overflowAutoOrScroll(el)) {
                return setCache(elems, el);
            }
        } while (el = el.parentElement);
    }

    function isContentOverflowing(el) {
        return (el.clientHeight + 10 < el.scrollHeight);
    }

// typically for <body> and <html>
    function overflowNotHidden(el) {
        var overflow = getComputedStyle(el, '').getPropertyValue('overflow-y');
        return (overflow !== 'hidden');
    }

// for all other elements
    function overflowAutoOrScroll(el) {
        var overflow = getComputedStyle(el, '').getPropertyValue('overflow-y');
        return (overflow === 'scroll' || overflow === 'auto');
    }


    /***********************************************
     * HELPERS
     ***********************************************/

    function addEvent(type, fn) {
        window.addEventListener(type, fn, false);
    }

    function removeEvent(type, fn) {
        window.removeEventListener(type, fn, false);
    }

    function isNodeName(el, tag) {
        return (el.nodeName||'').toLowerCase() === tag.toLowerCase();
    }

    function directionCheck(x, y) {
        x = (x > 0) ? 1 : -1;
        y = (y > 0) ? 1 : -1;
        if (direction.x !== x || direction.y !== y) {
            direction.x = x;
            direction.y = y;
            que = [];
            lastScroll = 0;
        }
    }

    var deltaBufferTimer;

    if (window.localStorage && localStorage.SS_deltaBuffer) {
        try { // #46 Safari throws in private browsing for localStorage
            deltaBuffer = localStorage.SS_deltaBuffer.split(',');
        } catch (e) { }
    }

    function isTouchpad(deltaY) {
        if (!deltaY) return;
        if (!deltaBuffer.length) {
            deltaBuffer = [deltaY, deltaY, deltaY];
        }
        deltaY = Math.abs(deltaY);
        deltaBuffer.push(deltaY);
        deltaBuffer.shift();
        clearTimeout(deltaBufferTimer);
        deltaBufferTimer = setTimeout(function () {
            try { // #46 Safari throws in private browsing for localStorage
                localStorage.SS_deltaBuffer = deltaBuffer.join(',');
            } catch (e) { }
        }, 1000);
        return !allDeltasDivisableBy(120) && !allDeltasDivisableBy(100);
    }

    function isDivisible(n, divisor) {
        return (Math.floor(n / divisor) == n / divisor);
    }

    function allDeltasDivisableBy(divisor) {
        return (isDivisible(deltaBuffer[0], divisor) &&
        isDivisible(deltaBuffer[1], divisor) &&
        isDivisible(deltaBuffer[2], divisor));
    }

    function isInsideYoutubeVideo(event) {
        var elem = event.target;
        var isControl = false;
        if (document.URL.indexOf ('www.youtube.com/watch') != -1) {
            do {
                isControl = (elem.classList &&
                elem.classList.contains('html5-video-controls'));
                if (isControl) break;
            } while (elem = elem.parentNode);
        }
        return isControl;
    }

    var requestFrame = (function () {
        return (window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function (callback, element, delay) {
            window.setTimeout(callback, delay || (1000/60));
        });
    })();

    var MutationObserver = (window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver);

    var getScrollRoot = (function() {
        var SCROLL_ROOT;
        return function() {
            if (!SCROLL_ROOT) {
                var dummy = document.createElement('div');
                dummy.style.cssText = 'height:10000px;width:1px;';
                document.body.appendChild(dummy);
                var bodyScrollTop  = document.body.scrollTop;
                var docElScrollTop = document.documentElement.scrollTop;
                window.scrollBy(0, 3);
                if (document.body.scrollTop != bodyScrollTop)
                    (SCROLL_ROOT = document.body);
                else
                    (SCROLL_ROOT = document.documentElement);
                window.scrollBy(0, -3);
                document.body.removeChild(dummy);
            }
            return SCROLL_ROOT;
        };
    })();


    /***********************************************
     * PULSE (by Michael Herf)
     ***********************************************/

    /**
     * Viscous fluid with a pulse for part and decay for the rest.
     * - Applies a fixed force over an interval (a damped acceleration), and
     * - Lets the exponential bleed away the velocity over a longer interval
     * - Michael Herf, http://stereopsis.com/stopping/
     */
    function pulse_(x) {
        var val, start, expx;
        // test
        x = x * options.pulseScale;
        if (x < 1) { // acceleartion
            val = x - (1 - Math.exp(-x));
        } else {     // tail
            // the previous animation ended here:
            start = Math.exp(-1);
            // simple viscous drag
            x -= 1;
            expx = 1 - Math.exp(-x);
            val = start + (expx * (1 - start));
        }
        return val * options.pulseNormalize;
    }

    function pulse(x) {
        if (x >= 1) return 1;
        if (x <= 0) return 0;

        if (options.pulseNormalize == 1) {
            options.pulseNormalize /= pulse_(1);
        }
        return pulse_(x);
    }


    /***********************************************
     * FIRST RUN
     ***********************************************/

    var userAgent = window.navigator.userAgent;
    var isEdge    = /Edge/.test(userAgent); // thank you MS
    var isChrome  = /chrome/i.test(userAgent) && !isEdge;
    var isSafari  = /safari/i.test(userAgent) && !isEdge;
    var isMobile  = /mobile/i.test(userAgent);
    var isIEWin7  = /Windows NT 6.1/i.test(userAgent) && /rv:11/i.test(userAgent);
    var isOldSafari = isSafari && (/Version\/8/i.test(userAgent) || /Version\/9/i.test(userAgent));
    var isEnabledForBrowser = (isChrome || isSafari || isIEWin7) && !isMobile;

    var wheelEvent;
    if ('onwheel' in document.createElement('div'))
        wheelEvent = 'wheel';
    else if ('onmousewheel' in document.createElement('div'))
        wheelEvent = 'mousewheel';

    if (wheelEvent && isEnabledForBrowser) {
        addEvent(wheelEvent, wheel);
        addEvent('mousedown', mousedown);
        addEvent('load', init);
    }


    /***********************************************
     * PUBLIC INTERFACE
     ***********************************************/

    function SmoothScroll(optionsToSet) {
        for (var key in optionsToSet)
            if (defaultOptions.hasOwnProperty(key))
                options[key] = optionsToSet[key];
    }
    SmoothScroll.destroy = cleanup;

    if (window.SmoothScrollOptions) // async API
        SmoothScroll(window.SmoothScrollOptions);

    if (typeof define === 'function' && define.amd)
        define(function() {
            return SmoothScroll;
        });
    else if ('object' == typeof exports)
        module.exports = SmoothScroll;
    else
        window.SmoothScroll = SmoothScroll;

})();

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Parallax = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
  /*
   object-assign
   (c) Sindre Sorhus
   @license MIT
   */

  'use strict';
  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
    if (val === null || val === undefined) {
      throw new TypeError('Object.assign cannot be called with null or undefined');
    }

    return Object(val);
  }

  function shouldUseNative() {
    try {
      if (!Object.assign) {
        return false;
      }

      // Detect buggy property enumeration order in older V8 versions.

      // https://bugs.chromium.org/p/v8/issues/detail?id=4118
      var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
      test1[5] = 'de';
      if (Object.getOwnPropertyNames(test1)[0] === '5') {
        return false;
      }

      // https://bugs.chromium.org/p/v8/issues/detail?id=3056
      var test2 = {};
      for (var i = 0; i < 10; i++) {
        test2['_' + String.fromCharCode(i)] = i;
      }
      var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
        return test2[n];
      });
      if (order2.join('') !== '0123456789') {
        return false;
      }

      // https://bugs.chromium.org/p/v8/issues/detail?id=3056
      var test3 = {};
      'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
        test3[letter] = letter;
      });
      if (Object.keys(Object.assign({}, test3)).join('') !==
        'abcdefghijklmnopqrst') {
        return false;
      }

      return true;
    } catch (err) {
      // We don't expect any of the above to throw, but better to be safe.
      return false;
    }
  }

  module.exports = shouldUseNative() ? Object.assign : function (target, source) {
    var from;
    var to = toObject(target);
    var symbols;

    for (var s = 1; s < arguments.length; s++) {
      from = Object(arguments[s]);

      for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
          to[key] = from[key];
        }
      }

      if (getOwnPropertySymbols) {
        symbols = getOwnPropertySymbols(from);
        for (var i = 0; i < symbols.length; i++) {
          if (propIsEnumerable.call(from, symbols[i])) {
            to[symbols[i]] = from[symbols[i]];
          }
        }
      }
    }

    return to;
  };

},{}],2:[function(require,module,exports){
  (function (process){
// Generated by CoffeeScript 1.12.2
    (function() {
      var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

      if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
        module.exports = function() {
          return performance.now();
        };
      } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
        module.exports = function() {
          return (getNanoSeconds() - nodeLoadTime) / 1e6;
        };
        hrtime = process.hrtime;
        getNanoSeconds = function() {
          var hr;
          hr = hrtime();
          return hr[0] * 1e9 + hr[1];
        };
        moduleLoadTime = getNanoSeconds();
        upTime = process.uptime() * 1e9;
        nodeLoadTime = moduleLoadTime - upTime;
      } else if (Date.now) {
        module.exports = function() {
          return Date.now() - loadTime;
        };
        loadTime = Date.now();
      } else {
        module.exports = function() {
          return new Date().getTime() - loadTime;
        };
        loadTime = new Date().getTime();
      }

    }).call(this);



  }).call(this,require('_process'))

},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
  var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

  var cachedSetTimeout;
  var cachedClearTimeout;

  function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
  }
  function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
  }
  (function () {
    try {
      if (typeof setTimeout === 'function') {
        cachedSetTimeout = setTimeout;
      } else {
        cachedSetTimeout = defaultSetTimout;
      }
    } catch (e) {
      cachedSetTimeout = defaultSetTimout;
    }
    try {
      if (typeof clearTimeout === 'function') {
        cachedClearTimeout = clearTimeout;
      } else {
        cachedClearTimeout = defaultClearTimeout;
      }
    } catch (e) {
      cachedClearTimeout = defaultClearTimeout;
    }
  } ())
  function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
      //normal enviroments in sane situations
      return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
      cachedSetTimeout = setTimeout;
      return setTimeout(fun, 0);
    }
    try {
      // when when somebody has screwed with setTimeout but no I.E. maddness
      return cachedSetTimeout(fun, 0);
    } catch(e){
      try {
        // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
        return cachedSetTimeout.call(null, fun, 0);
      } catch(e){
        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
        return cachedSetTimeout.call(this, fun, 0);
      }
    }


  }
  function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
      //normal enviroments in sane situations
      return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
      cachedClearTimeout = clearTimeout;
      return clearTimeout(marker);
    }
    try {
      // when when somebody has screwed with setTimeout but no I.E. maddness
      return cachedClearTimeout(marker);
    } catch (e){
      try {
        // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
        return cachedClearTimeout.call(null, marker);
      } catch (e){
        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
        // Some versions of I.E. have different rules for clearTimeout vs setTimeout
        return cachedClearTimeout.call(this, marker);
      }
    }



  }
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;

  function cleanUpNextTick() {
    if (!draining || !currentQueue) {
      return;
    }
    draining = false;
    if (currentQueue.length) {
      queue = currentQueue.concat(queue);
    } else {
      queueIndex = -1;
    }
    if (queue.length) {
      drainQueue();
    }
  }

  function drainQueue() {
    if (draining) {
      return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
      currentQueue = queue;
      queue = [];
      while (++queueIndex < len) {
        if (currentQueue) {
          currentQueue[queueIndex].run();
        }
      }
      queueIndex = -1;
      len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
  }

  process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
      runTimeout(drainQueue);
    }
  };

// v8 likes predictible objects
  function Item(fun, array) {
    this.fun = fun;
    this.array = array;
  }
  Item.prototype.run = function () {
    this.fun.apply(null, this.array);
  };
  process.title = 'browser';
  process.browser = true;
  process.env = {};
  process.argv = [];
  process.version = ''; // empty string to avoid regexp issues
  process.versions = {};

  function noop() {}

  process.on = noop;
  process.addListener = noop;
  process.once = noop;
  process.off = noop;
  process.removeListener = noop;
  process.removeAllListeners = noop;
  process.emit = noop;
  process.prependListener = noop;
  process.prependOnceListener = noop;

  process.listeners = function (name) { return [] }

  process.binding = function (name) {
    throw new Error('process.binding is not supported');
  };

  process.cwd = function () { return '/' };
  process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
  };
  process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
  (function (global){
    var now = require('performance-now')
      , root = typeof window === 'undefined' ? global : window
      , vendors = ['moz', 'webkit']
      , suffix = 'AnimationFrame'
      , raf = root['request' + suffix]
      , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

    for(var i = 0; !raf && i < vendors.length; i++) {
      raf = root[vendors[i] + 'Request' + suffix]
      caf = root[vendors[i] + 'Cancel' + suffix]
        || root[vendors[i] + 'CancelRequest' + suffix]
    }

// Some versions of FF have rAF but not cAF
    if(!raf || !caf) {
      var last = 0
        , id = 0
        , queue = []
        , frameDuration = 1000 / 60

      raf = function(callback) {
        if(queue.length === 0) {
          var _now = now()
            , next = Math.max(0, frameDuration - (_now - last))
          last = next + _now
          setTimeout(function() {
            var cp = queue.slice(0)
            // Clear queue here to prevent
            // callbacks from appending listeners
            // to the current frame's queue
            queue.length = 0
            for(var i = 0; i < cp.length; i++) {
              if(!cp[i].cancelled) {
                try{
                  cp[i].callback(last)
                } catch(e) {
                  setTimeout(function() { throw e }, 0)
                }
              }
            }
          }, Math.round(next))
        }
        queue.push({
          handle: ++id,
          callback: callback,
          cancelled: false
        })
        return id
      }

      caf = function(handle) {
        for(var i = 0; i < queue.length; i++) {
          if(queue[i].handle === handle) {
            queue[i].cancelled = true
          }
        }
      }
    }

    module.exports = function(fn) {
      // Wrap in a new function to prevent
      // `cancel` potentially being assigned
      // to the native rAF function
      return raf.call(root, fn)
    }
    module.exports.cancel = function() {
      caf.apply(root, arguments)
    }
    module.exports.polyfill = function() {
      root.requestAnimationFrame = raf
      root.cancelAnimationFrame = caf
    }

  }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"performance-now":2}],5:[function(require,module,exports){
  'use strict';

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  /**
   * Parallax.js
   * @author Matthew Wagerfield - @wagerfield, René Roth - mail@reneroth.org
   * @description Creates a parallax effect between an array of layers,
   *              driving the motion from the gyroscope output of a smartdevice.
   *              If no gyroscope is available, the cursor position is used.
   */

  var rqAnFr = require('raf');
  var objectAssign = require('object-assign');

  var helpers = {
    propertyCache: {},
    vendors: [null, ['-webkit-', 'webkit'], ['-moz-', 'Moz'], ['-o-', 'O'], ['-ms-', 'ms']],

    clamp: function clamp(value, min, max) {
      return min < max ? value < min ? min : value > max ? max : value : value < max ? max : value > min ? min : value;
    },
    data: function data(element, name) {
      return helpers.deserialize(element.getAttribute('data-' + name));
    },
    deserialize: function deserialize(value) {
      if (value === 'true') {
        return true;
      } else if (value === 'false') {
        return false;
      } else if (value === 'null') {
        return null;
      } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
        return parseFloat(value);
      } else {
        return value;
      }
    },
    camelCase: function camelCase(value) {
      return value.replace(/-+(.)?/g, function (match, character) {
        return character ? character.toUpperCase() : '';
      });
    },
    accelerate: function accelerate(element) {
      helpers.css(element, 'transform', 'translate3d(0,0,0) rotate(0.0001deg)');
      helpers.css(element, 'transform-style', 'preserve-3d');
      helpers.css(element, 'backface-visibility', 'hidden');
    },
    transformSupport: function transformSupport(value) {
      var element = document.createElement('div'),
        propertySupport = false,
        propertyValue = null,
        featureSupport = false,
        cssProperty = null,
        jsProperty = null;
      for (var i = 0, l = helpers.vendors.length; i < l; i++) {
        if (helpers.vendors[i] !== null) {
          cssProperty = helpers.vendors[i][0] + 'transform';
          jsProperty = helpers.vendors[i][1] + 'Transform';
        } else {
          cssProperty = 'transform';
          jsProperty = 'transform';
        }
        if (element.style[jsProperty] !== undefined) {
          propertySupport = true;
          break;
        }
      }
      switch (value) {
        case '2D':
          featureSupport = propertySupport;
          break;
        case '3D':
          if (propertySupport) {
            var body = document.body || document.createElement('body'),
              documentElement = document.documentElement,
              documentOverflow = documentElement.style.overflow,
              isCreatedBody = false;

            if (!document.body) {
              isCreatedBody = true;
              documentElement.style.overflow = 'hidden';
              documentElement.appendChild(body);
              body.style.overflow = 'hidden';
              body.style.background = '';
            }

            body.appendChild(element);
            element.style[jsProperty] = 'translate3d(1px,1px,1px)';
            propertyValue = window.getComputedStyle(element).getPropertyValue(cssProperty);
            featureSupport = propertyValue !== undefined && propertyValue.length > 0 && propertyValue !== 'none';
            documentElement.style.overflow = documentOverflow;
            body.removeChild(element);

            if (isCreatedBody) {
              body.removeAttribute('style');
              body.parentNode.removeChild(body);
            }
          }
          break;
      }
      return featureSupport;
    },
    css: function css(element, property, value) {
      var jsProperty = helpers.propertyCache[property];
      if (!jsProperty) {
        for (var i = 0, l = helpers.vendors.length; i < l; i++) {
          if (helpers.vendors[i] !== null) {
            jsProperty = helpers.camelCase(helpers.vendors[i][1] + '-' + property);
          } else {
            jsProperty = property;
          }
          if (element.style[jsProperty] !== undefined) {
            helpers.propertyCache[property] = jsProperty;
            break;
          }
        }
      }
      element.style[jsProperty] = value;
    }
  };

  var MAGIC_NUMBER = 30,
    DEFAULTS = {
      relativeInput: false,
      clipRelativeInput: false,
      inputElement: null,
      hoverOnly: false,
      calibrationThreshold: 100,
      calibrationDelay: 500,
      supportDelay: 500,
      calibrateX: false,
      calibrateY: true,
      invertX: true,
      invertY: true,
      limitX: false,
      limitY: false,
      scalarX: 10.0,
      scalarY: 10.0,
      frictionX: 0.1,
      frictionY: 0.1,
      originX: 0.5,
      originY: 0.5,
      pointerEvents: false,
      precision: 1,
      onReady: null
    };

  var Parallax = function () {
    function Parallax(element, options) {
      _classCallCheck(this, Parallax);

      this.element = element;
      this.layers = element.getElementsByClassName('layer');

      var data = {
        calibrateX: helpers.data(this.element, 'calibrate-x'),
        calibrateY: helpers.data(this.element, 'calibrate-y'),
        invertX: helpers.data(this.element, 'invert-x'),
        invertY: helpers.data(this.element, 'invert-y'),
        limitX: helpers.data(this.element, 'limit-x'),
        limitY: helpers.data(this.element, 'limit-y'),
        scalarX: helpers.data(this.element, 'scalar-x'),
        scalarY: helpers.data(this.element, 'scalar-y'),
        frictionX: helpers.data(this.element, 'friction-x'),
        frictionY: helpers.data(this.element, 'friction-y'),
        originX: helpers.data(this.element, 'origin-x'),
        originY: helpers.data(this.element, 'origin-y'),
        pointerEvents: helpers.data(this.element, 'pointer-events'),
        precision: helpers.data(this.element, 'precision'),
        relativeInput: helpers.data(this.element, 'relative-input'),
        clipRelativeInput: helpers.data(this.element, 'clip-relative-input'),
        hoverOnly: helpers.data(this.element, 'hover-only'),
        inputElement: document.querySelector(helpers.data(this.element, 'input-element'))
      };

      for (var key in data) {
        if (data[key] === null) {
          delete data[key];
        }
      }

      objectAssign(this, DEFAULTS, data, options);

      if (!this.inputElement) {
        this.inputElement = this.element;
      }

      this.calibrationTimer = null;
      this.calibrationFlag = true;
      this.enabled = false;
      this.depthsX = [];
      this.depthsY = [];
      this.raf = null;

      this.bounds = null;
      this.elementPositionX = 0;
      this.elementPositionY = 0;
      this.elementWidth = 0;
      this.elementHeight = 0;

      this.elementCenterX = 0;
      this.elementCenterY = 0;

      this.elementRangeX = 0;
      this.elementRangeY = 0;

      this.calibrationX = 0;
      this.calibrationY = 0;

      this.inputX = 0;
      this.inputY = 0;

      this.motionX = 0;
      this.motionY = 0;

      this.velocityX = 0;
      this.velocityY = 0;

      this.onMouseMove = this.onMouseMove.bind(this);
      this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
      this.onDeviceMotion = this.onDeviceMotion.bind(this);
      this.onOrientationTimer = this.onOrientationTimer.bind(this);
      this.onMotionTimer = this.onMotionTimer.bind(this);
      this.onCalibrationTimer = this.onCalibrationTimer.bind(this);
      this.onAnimationFrame = this.onAnimationFrame.bind(this);
      this.onWindowResize = this.onWindowResize.bind(this);

      this.windowWidth = null;
      this.windowHeight = null;
      this.windowCenterX = null;
      this.windowCenterY = null;
      this.windowRadiusX = null;
      this.windowRadiusY = null;
      this.portrait = false;
      this.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);
      this.motionSupport = !!window.DeviceMotionEvent && !this.desktop;
      this.orientationSupport = !!window.DeviceOrientationEvent && !this.desktop;
      this.orientationStatus = 0;
      this.motionStatus = 0;

      this.initialise();
    }

    _createClass(Parallax, [{
      key: 'initialise',
      value: function initialise() {
        if (this.transform2DSupport === undefined) {
          this.transform2DSupport = helpers.transformSupport('2D');
          this.transform3DSupport = helpers.transformSupport('3D');
        }

        // Configure Context Styles
        if (this.transform3DSupport) {
          helpers.accelerate(this.element);
        }

        var style = window.getComputedStyle(this.element);
        /*      if (style.getPropertyValue('position') === 'static') {
         this.element.style.position = 'relative';
         }*/

        // Pointer events
        if (!this.pointerEvents) {
          this.element.style.pointerEvents = 'none';
        }

        // Setup
        this.updateLayers();
        this.updateDimensions();
        this.enable();
        this.queueCalibration(this.calibrationDelay);
      }
    }, {
      key: 'doReadyCallback',
      value: function doReadyCallback() {
        if (this.onReady) {
          this.onReady();
        }
      }
    }, {
      key: 'updateLayers',
      value: function updateLayers() {
        this.layers = this.element.children;
        this.depthsX = [];
        this.depthsY = [];

        for (var index = 0; index < this.layers.length; index++) {
          var layer = this.layers[index];

          if (this.transform3DSupport) {
            helpers.accelerate(layer);
          }

          //layer.style.position = index ? 'absolute' : 'relative';
          //layer.style.display = 'block';
          //layer.style.left = 0;
          //layer.style.top = 0;

          var depth = helpers.data(layer, 'depth') || 0;
          this.depthsX.push(helpers.data(layer, 'depth-x') || depth);
          this.depthsY.push(helpers.data(layer, 'depth-y') || depth);
        }
      }
    }, {
      key: 'updateDimensions',
      value: function updateDimensions() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.windowCenterX = this.windowWidth * this.originX;
        this.windowCenterY = this.windowHeight * this.originY;
        this.windowRadiusX = Math.max(this.windowCenterX, this.windowWidth - this.windowCenterX);
        this.windowRadiusY = Math.max(this.windowCenterY, this.windowHeight - this.windowCenterY);
      }
    }, {
      key: 'updateBounds',
      value: function updateBounds() {
        this.bounds = this.inputElement.getBoundingClientRect();
        this.elementPositionX = this.bounds.left;
        this.elementPositionY = this.bounds.top;
        this.elementWidth = this.bounds.width;
        this.elementHeight = this.bounds.height;
        this.elementCenterX = this.elementWidth * this.originX;
        this.elementCenterY = this.elementHeight * this.originY;
        this.elementRangeX = Math.max(this.elementCenterX, this.elementWidth - this.elementCenterX);
        this.elementRangeY = Math.max(this.elementCenterY, this.elementHeight - this.elementCenterY);
      }
    }, {
      key: 'queueCalibration',
      value: function queueCalibration(delay) {
        clearTimeout(this.calibrationTimer);
        this.calibrationTimer = setTimeout(this.onCalibrationTimer, delay);
      }
    }, {
      key: 'enable',
      value: function enable() {
        if (this.enabled) {
          return;
        }
        this.enabled = true;

        if (this.orientationSupport) {
          this.portrait = false;
          window.addEventListener('deviceorientation', this.onDeviceOrientation);
          setTimeout(this.onOrientationTimer, this.supportDelay);
        } else if (this.motionSupport) {
          this.portrait = false;
          window.addEventListener('devicemotion', this.onDeviceMotion);
          setTimeout(this.onMotionTimer, this.supportDelay);
        } else {
          this.calibrationX = 0;
          this.calibrationY = 0;
          this.portrait = false;
          window.addEventListener('mousemove', this.onMouseMove);
          this.doReadyCallback();
        }

        window.addEventListener('resize', this.onWindowResize);
        this.raf = rqAnFr(this.onAnimationFrame);
      }
    }, {
      key: 'disable',
      value: function disable() {
        if (!this.enabled) {
          return;
        }
        this.enabled = false;

        if (this.orientationSupport) {
          window.removeEventListener('deviceorientation', this.onDeviceOrientation);
        } else if (this.motionSupport) {
          window.removeEventListener('devicemotion', this.onDeviceMotion);
        } else {
          window.removeEventListener('mousemove', this.onMouseMove);
        }

        window.removeEventListener('resize', this.onWindowResize);
        rqAnFr.cancel(this.raf);
      }
    }, {
      key: 'calibrate',
      value: function calibrate(x, y) {
        this.calibrateX = x === undefined ? this.calibrateX : x;
        this.calibrateY = y === undefined ? this.calibrateY : y;
      }
    }, {
      key: 'invert',
      value: function invert(x, y) {
        this.invertX = x === undefined ? this.invertX : x;
        this.invertY = y === undefined ? this.invertY : y;
      }
    }, {
      key: 'friction',
      value: function friction(x, y) {
        this.frictionX = x === undefined ? this.frictionX : x;
        this.frictionY = y === undefined ? this.frictionY : y;
      }
    }, {
      key: 'scalar',
      value: function scalar(x, y) {
        this.scalarX = x === undefined ? this.scalarX : x;
        this.scalarY = y === undefined ? this.scalarY : y;
      }
    }, {
      key: 'limit',
      value: function limit(x, y) {
        this.limitX = x === undefined ? this.limitX : x;
        this.limitY = y === undefined ? this.limitY : y;
      }
    }, {
      key: 'origin',
      value: function origin(x, y) {
        this.originX = x === undefined ? this.originX : x;
        this.originY = y === undefined ? this.originY : y;
      }
    }, {
      key: 'setInputElement',
      value: function setInputElement(element) {
        this.inputElement = element;
        this.updateDimensions();
      }
    }, {
      key: 'setPosition',
      value: function setPosition(element, x, y) {
        x = x.toFixed(this.precision) + 'px';
        y = y.toFixed(this.precision) + 'px';
        if (this.transform3DSupport) {
          helpers.css(element, 'transform', 'translate3d(' + x + ',' + y + ',0)');
        } else if (this.transform2DSupport) {
          helpers.css(element, 'transform', 'translate(' + x + ',' + y + ')');
        } else {
          element.style.left = x;
          element.style.top = y;
        }
      }
    }, {
      key: 'onOrientationTimer',
      value: function onOrientationTimer() {
        if (this.orientationSupport && this.orientationStatus === 0) {
          this.disable();
          this.orientationSupport = false;
          this.enable();
        } else {
          this.doReadyCallback();
        }
      }
    }, {
      key: 'onMotionTimer',
      value: function onMotionTimer() {
        if (this.motionSupport && this.motionStatus === 0) {
          this.disable();
          this.motionSupport = false;
          this.enable();
        } else {
          this.doReadyCallback();
        }
      }
    }, {
      key: 'onCalibrationTimer',
      value: function onCalibrationTimer() {
        this.calibrationFlag = true;
      }
    }, {
      key: 'onWindowResize',
      value: function onWindowResize() {
        this.updateDimensions();
      }
    }, {
      key: 'onAnimationFrame',
      value: function onAnimationFrame() {
        this.updateBounds();
        var calibratedInputX = this.inputX - this.calibrationX,
          calibratedInputY = this.inputY - this.calibrationY;
        if (Math.abs(calibratedInputX) > this.calibrationThreshold || Math.abs(calibratedInputY) > this.calibrationThreshold) {
          this.queueCalibration(0);
        }
        if (this.portrait) {
          this.motionX = this.calibrateX ? calibratedInputY : this.inputY;
          this.motionY = this.calibrateY ? calibratedInputX : this.inputX;
        } else {
          this.motionX = this.calibrateX ? calibratedInputX : this.inputX;
          this.motionY = this.calibrateY ? calibratedInputY : this.inputY;
        }
        this.motionX *= this.elementWidth * (this.scalarX / 100);
        this.motionY *= this.elementHeight * (this.scalarY / 100);
        if (!isNaN(parseFloat(this.limitX))) {
          this.motionX = helpers.clamp(this.motionX, -this.limitX, this.limitX);
        }
        if (!isNaN(parseFloat(this.limitY))) {
          this.motionY = helpers.clamp(this.motionY, -this.limitY, this.limitY);
        }
        this.velocityX += (this.motionX - this.velocityX) * this.frictionX;
        this.velocityY += (this.motionY - this.velocityY) * this.frictionY;
        for (var index = 0; index < this.layers.length; index++) {
          var layer = this.layers[index],
            depthX = this.depthsX[index],
            depthY = this.depthsY[index],
            xOffset = this.velocityX * (depthX * (this.invertX ? -1 : 1)),
            yOffset = this.velocityY * (depthY * (this.invertY ? -1 : 1));
          this.setPosition(layer, xOffset, yOffset);
        }
        this.raf = rqAnFr(this.onAnimationFrame);
      }
    }, {
      key: 'rotate',
      value: function rotate(beta, gamma) {
        // Extract Rotation
        var x = (beta || 0) / MAGIC_NUMBER,
          //  -90 :: 90
          y = (gamma || 0) / MAGIC_NUMBER; // -180 :: 180

        // Detect Orientation Change
        var portrait = this.windowHeight > this.windowWidth;
        if (this.portrait !== portrait) {
          this.portrait = portrait;
          this.calibrationFlag = true;
        }

        if (this.calibrationFlag) {
          this.calibrationFlag = false;
          this.calibrationX = x;
          this.calibrationY = y;
        }

        this.inputX = x;
        this.inputY = y;
      }
    }, {
      key: 'onDeviceOrientation',
      value: function onDeviceOrientation(event) {
        var beta = event.beta;
        var gamma = event.gamma;
        if (beta !== null && gamma !== null) {
          this.orientationStatus = 1;
          this.rotate(beta, gamma);
        }
      }
    }, {
      key: 'onDeviceMotion',
      value: function onDeviceMotion(event) {
        var beta = event.rotationRate.beta;
        var gamma = event.rotationRate.gamma;
        if (beta !== null && gamma !== null) {
          this.motionStatus = 1;
          this.rotate(beta, gamma);
        }
      }
    }, {
      key: 'onMouseMove',
      value: function onMouseMove(event) {
        var clientX = event.clientX,
          clientY = event.clientY;

        // reset input to center if hoverOnly is set and we're not hovering the element
        if (this.hoverOnly && (clientX < this.elementPositionX || clientX > this.elementPositionX + this.elementWidth || clientY < this.elementPositionY || clientY > this.elementPositionY + this.elementHeight)) {
          this.inputX = 0;
          this.inputY = 0;
          return;
        }

        if (this.relativeInput) {
          // Clip mouse coordinates inside element bounds.
          if (this.clipRelativeInput) {
            clientX = Math.max(clientX, this.elementPositionX);
            clientX = Math.min(clientX, this.elementPositionX + this.elementWidth);
            clientY = Math.max(clientY, this.elementPositionY);
            clientY = Math.min(clientY, this.elementPositionY + this.elementHeight);
          }
          // Calculate input relative to the element.
          if (this.elementRangeX && this.elementRangeY) {
            this.inputX = (clientX - this.elementPositionX - this.elementCenterX) / this.elementRangeX;
            this.inputY = (clientY - this.elementPositionY - this.elementCenterY) / this.elementRangeY;
          }
        } else {
          // Calculate input relative to the window.
          if (this.windowRadiusX && this.windowRadiusY) {
            this.inputX = (clientX - this.windowCenterX) / this.windowRadiusX;
            this.inputY = (clientY - this.windowCenterY) / this.windowRadiusY;
          }
        }
      }
    }]);

    return Parallax;
  }();

  module.exports = Parallax;

},{"object-assign":1,"raf":4}]},{},[5])(5)
});