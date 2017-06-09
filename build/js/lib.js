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

/*! jQuery UI - v1.12.1 - 2017-05-20
 * http://jqueryui.com
 * Includes: widget.js, keycode.js, widgets/mouse.js, widgets/slider.js, effect.js, effects/effect-slide.js
 * Copyright jQuery Foundation and other contributors; Licensed MIT */

(function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)})(function(t){t.ui=t.ui||{},t.ui.version="1.12.1";var e=0,i=Array.prototype.slice;t.cleanData=function(e){return function(i){var s,n,o;for(o=0;null!=(n=i[o]);o++)try{s=t._data(n,"events"),s&&s.remove&&t(n).triggerHandler("remove")}catch(a){}e(i)}}(t.cleanData),t.widget=function(e,i,s){var n,o,a,r={},l=e.split(".")[0];e=e.split(".")[1];var h=l+"-"+e;return s||(s=i,i=t.Widget),t.isArray(s)&&(s=t.extend.apply(null,[{}].concat(s))),t.expr[":"][h.toLowerCase()]=function(e){return!!t.data(e,h)},t[l]=t[l]||{},n=t[l][e],o=t[l][e]=function(t,e){return this._createWidget?(arguments.length&&this._createWidget(t,e),void 0):new o(t,e)},t.extend(o,n,{version:s.version,_proto:t.extend({},s),_childConstructors:[]}),a=new i,a.options=t.widget.extend({},a.options),t.each(s,function(e,s){return t.isFunction(s)?(r[e]=function(){function t(){return i.prototype[e].apply(this,arguments)}function n(t){return i.prototype[e].apply(this,t)}return function(){var e,i=this._super,o=this._superApply;return this._super=t,this._superApply=n,e=s.apply(this,arguments),this._super=i,this._superApply=o,e}}(),void 0):(r[e]=s,void 0)}),o.prototype=t.widget.extend(a,{widgetEventPrefix:n?a.widgetEventPrefix||e:e},r,{constructor:o,namespace:l,widgetName:e,widgetFullName:h}),n?(t.each(n._childConstructors,function(e,i){var s=i.prototype;t.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete n._childConstructors):i._childConstructors.push(o),t.widget.bridge(e,o),o},t.widget.extend=function(e){for(var s,n,o=i.call(arguments,1),a=0,r=o.length;r>a;a++)for(s in o[a])n=o[a][s],o[a].hasOwnProperty(s)&&void 0!==n&&(e[s]=t.isPlainObject(n)?t.isPlainObject(e[s])?t.widget.extend({},e[s],n):t.widget.extend({},n):n);return e},t.widget.bridge=function(e,s){var n=s.prototype.widgetFullName||e;t.fn[e]=function(o){var a="string"==typeof o,r=i.call(arguments,1),l=this;return a?this.length||"instance"!==o?this.each(function(){var i,s=t.data(this,n);return"instance"===o?(l=s,!1):s?t.isFunction(s[o])&&"_"!==o.charAt(0)?(i=s[o].apply(s,r),i!==s&&void 0!==i?(l=i&&i.jquery?l.pushStack(i.get()):i,!1):void 0):t.error("no such method '"+o+"' for "+e+" widget instance"):t.error("cannot call methods on "+e+" prior to initialization; "+"attempted to call method '"+o+"'")}):l=void 0:(r.length&&(o=t.widget.extend.apply(null,[o].concat(r))),this.each(function(){var e=t.data(this,n);e?(e.option(o||{}),e._init&&e._init()):t.data(this,n,new s(o,this))})),l}},t.Widget=function(){},t.Widget._childConstructors=[],t.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{classes:{},disabled:!1,create:null},_createWidget:function(i,s){s=t(s||this.defaultElement||this)[0],this.element=t(s),this.uuid=e++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=t(),this.hoverable=t(),this.focusable=t(),this.classesElementLookup={},s!==this&&(t.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(t){t.target===s&&this.destroy()}}),this.document=t(s.style?s.ownerDocument:s.document||s),this.window=t(this.document[0].defaultView||this.document[0].parentWindow)),this.options=t.widget.extend({},this.options,this._getCreateOptions(),i),this._create(),this.options.disabled&&this._setOptionDisabled(this.options.disabled),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:function(){return{}},_getCreateEventData:t.noop,_create:t.noop,_init:t.noop,destroy:function(){var e=this;this._destroy(),t.each(this.classesElementLookup,function(t,i){e._removeClass(i,t)}),this.element.off(this.eventNamespace).removeData(this.widgetFullName),this.widget().off(this.eventNamespace).removeAttr("aria-disabled"),this.bindings.off(this.eventNamespace)},_destroy:t.noop,widget:function(){return this.element},option:function(e,i){var s,n,o,a=e;if(0===arguments.length)return t.widget.extend({},this.options);if("string"==typeof e)if(a={},s=e.split("."),e=s.shift(),s.length){for(n=a[e]=t.widget.extend({},this.options[e]),o=0;s.length-1>o;o++)n[s[o]]=n[s[o]]||{},n=n[s[o]];if(e=s.pop(),1===arguments.length)return void 0===n[e]?null:n[e];n[e]=i}else{if(1===arguments.length)return void 0===this.options[e]?null:this.options[e];a[e]=i}return this._setOptions(a),this},_setOptions:function(t){var e;for(e in t)this._setOption(e,t[e]);return this},_setOption:function(t,e){return"classes"===t&&this._setOptionClasses(e),this.options[t]=e,"disabled"===t&&this._setOptionDisabled(e),this},_setOptionClasses:function(e){var i,s,n;for(i in e)n=this.classesElementLookup[i],e[i]!==this.options.classes[i]&&n&&n.length&&(s=t(n.get()),this._removeClass(n,i),s.addClass(this._classes({element:s,keys:i,classes:e,add:!0})))},_setOptionDisabled:function(t){this._toggleClass(this.widget(),this.widgetFullName+"-disabled",null,!!t),t&&(this._removeClass(this.hoverable,null,"ui-state-hover"),this._removeClass(this.focusable,null,"ui-state-focus"))},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_classes:function(e){function i(i,o){var a,r;for(r=0;i.length>r;r++)a=n.classesElementLookup[i[r]]||t(),a=e.add?t(t.unique(a.get().concat(e.element.get()))):t(a.not(e.element).get()),n.classesElementLookup[i[r]]=a,s.push(i[r]),o&&e.classes[i[r]]&&s.push(e.classes[i[r]])}var s=[],n=this;return e=t.extend({element:this.element,classes:this.options.classes||{}},e),this._on(e.element,{remove:"_untrackClassesElement"}),e.keys&&i(e.keys.match(/\S+/g)||[],!0),e.extra&&i(e.extra.match(/\S+/g)||[]),s.join(" ")},_untrackClassesElement:function(e){var i=this;t.each(i.classesElementLookup,function(s,n){-1!==t.inArray(e.target,n)&&(i.classesElementLookup[s]=t(n.not(e.target).get()))})},_removeClass:function(t,e,i){return this._toggleClass(t,e,i,!1)},_addClass:function(t,e,i){return this._toggleClass(t,e,i,!0)},_toggleClass:function(t,e,i,s){s="boolean"==typeof s?s:i;var n="string"==typeof t||null===t,o={extra:n?e:i,keys:n?t:e,element:n?this.element:t,add:s};return o.element.toggleClass(this._classes(o),s),this},_on:function(e,i,s){var n,o=this;"boolean"!=typeof e&&(s=i,i=e,e=!1),s?(i=n=t(i),this.bindings=this.bindings.add(i)):(s=i,i=this.element,n=this.widget()),t.each(s,function(s,a){function r(){return e||o.options.disabled!==!0&&!t(this).hasClass("ui-state-disabled")?("string"==typeof a?o[a]:a).apply(o,arguments):void 0}"string"!=typeof a&&(r.guid=a.guid=a.guid||r.guid||t.guid++);var l=s.match(/^([\w:-]*)\s*(.*)$/),h=l[1]+o.eventNamespace,c=l[2];c?n.on(h,c,r):i.on(h,r)})},_off:function(e,i){i=(i||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.off(i).off(i),this.bindings=t(this.bindings.not(e).get()),this.focusable=t(this.focusable.not(e).get()),this.hoverable=t(this.hoverable.not(e).get())},_delay:function(t,e){function i(){return("string"==typeof t?s[t]:t).apply(s,arguments)}var s=this;return setTimeout(i,e||0)},_hoverable:function(e){this.hoverable=this.hoverable.add(e),this._on(e,{mouseenter:function(e){this._addClass(t(e.currentTarget),null,"ui-state-hover")},mouseleave:function(e){this._removeClass(t(e.currentTarget),null,"ui-state-hover")}})},_focusable:function(e){this.focusable=this.focusable.add(e),this._on(e,{focusin:function(e){this._addClass(t(e.currentTarget),null,"ui-state-focus")},focusout:function(e){this._removeClass(t(e.currentTarget),null,"ui-state-focus")}})},_trigger:function(e,i,s){var n,o,a=this.options[e];if(s=s||{},i=t.Event(i),i.type=(e===this.widgetEventPrefix?e:this.widgetEventPrefix+e).toLowerCase(),i.target=this.element[0],o=i.originalEvent)for(n in o)n in i||(i[n]=o[n]);return this.element.trigger(i,s),!(t.isFunction(a)&&a.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},t.each({show:"fadeIn",hide:"fadeOut"},function(e,i){t.Widget.prototype["_"+e]=function(s,n,o){"string"==typeof n&&(n={effect:n});var a,r=n?n===!0||"number"==typeof n?i:n.effect||i:e;n=n||{},"number"==typeof n&&(n={duration:n}),a=!t.isEmptyObject(n),n.complete=o,n.delay&&s.delay(n.delay),a&&t.effects&&t.effects.effect[r]?s[e](n):r!==e&&s[r]?s[r](n.duration,n.easing,o):s.queue(function(i){t(this)[e](),o&&o.call(s[0]),i()})}}),t.widget,t.ui.keyCode={BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38},t.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());var s=!1;t(document).on("mouseup",function(){s=!1}),t.widget("ui.mouse",{version:"1.12.1",options:{cancel:"input, textarea, button, select, option",distance:1,delay:0},_mouseInit:function(){var e=this;this.element.on("mousedown."+this.widgetName,function(t){return e._mouseDown(t)}).on("click."+this.widgetName,function(i){return!0===t.data(i.target,e.widgetName+".preventClickEvent")?(t.removeData(i.target,e.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):void 0}),this.started=!1},_mouseDestroy:function(){this.element.off("."+this.widgetName),this._mouseMoveDelegate&&this.document.off("mousemove."+this.widgetName,this._mouseMoveDelegate).off("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(e){if(!s){this._mouseMoved=!1,this._mouseStarted&&this._mouseUp(e),this._mouseDownEvent=e;var i=this,n=1===e.which,o="string"==typeof this.options.cancel&&e.target.nodeName?t(e.target).closest(this.options.cancel).length:!1;return n&&!o&&this._mouseCapture(e)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){i.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(e)!==!1,!this._mouseStarted)?(e.preventDefault(),!0):(!0===t.data(e.target,this.widgetName+".preventClickEvent")&&t.removeData(e.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(t){return i._mouseMove(t)},this._mouseUpDelegate=function(t){return i._mouseUp(t)},this.document.on("mousemove."+this.widgetName,this._mouseMoveDelegate).on("mouseup."+this.widgetName,this._mouseUpDelegate),e.preventDefault(),s=!0,!0)):!0}},_mouseMove:function(e){if(this._mouseMoved){if(t.ui.ie&&(!document.documentMode||9>document.documentMode)&&!e.button)return this._mouseUp(e);if(!e.which)if(e.originalEvent.altKey||e.originalEvent.ctrlKey||e.originalEvent.metaKey||e.originalEvent.shiftKey)this.ignoreMissingWhich=!0;else if(!this.ignoreMissingWhich)return this._mouseUp(e)}return(e.which||e.button)&&(this._mouseMoved=!0),this._mouseStarted?(this._mouseDrag(e),e.preventDefault()):(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,e)!==!1,this._mouseStarted?this._mouseDrag(e):this._mouseUp(e)),!this._mouseStarted)},_mouseUp:function(e){this.document.off("mousemove."+this.widgetName,this._mouseMoveDelegate).off("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,e.target===this._mouseDownEvent.target&&t.data(e.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(e)),this._mouseDelayTimer&&(clearTimeout(this._mouseDelayTimer),delete this._mouseDelayTimer),this.ignoreMissingWhich=!1,s=!1,e.preventDefault()},_mouseDistanceMet:function(t){return Math.max(Math.abs(this._mouseDownEvent.pageX-t.pageX),Math.abs(this._mouseDownEvent.pageY-t.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}}),t.widget("ui.slider",t.ui.mouse,{version:"1.12.1",widgetEventPrefix:"slide",options:{animate:!1,classes:{"ui-slider":"ui-corner-all","ui-slider-handle":"ui-corner-all","ui-slider-range":"ui-corner-all ui-widget-header"},distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null,change:null,slide:null,start:null,stop:null},numPages:5,_create:function(){this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this._calculateNewMax(),this._addClass("ui-slider ui-slider-"+this.orientation,"ui-widget ui-widget-content"),this._refresh(),this._animateOff=!1},_refresh:function(){this._createRange(),this._createHandles(),this._setupEvents(),this._refreshValue()},_createHandles:function(){var e,i,s=this.options,n=this.element.find(".ui-slider-handle"),o="<span tabindex='0'></span>",a=[];for(i=s.values&&s.values.length||1,n.length>i&&(n.slice(i).remove(),n=n.slice(0,i)),e=n.length;i>e;e++)a.push(o);this.handles=n.add(t(a.join("")).appendTo(this.element)),this._addClass(this.handles,"ui-slider-handle","ui-state-default"),this.handle=this.handles.eq(0),this.handles.each(function(e){t(this).data("ui-slider-handle-index",e).attr("tabIndex",0)})},_createRange:function(){var e=this.options;e.range?(e.range===!0&&(e.values?e.values.length&&2!==e.values.length?e.values=[e.values[0],e.values[0]]:t.isArray(e.values)&&(e.values=e.values.slice(0)):e.values=[this._valueMin(),this._valueMin()]),this.range&&this.range.length?(this._removeClass(this.range,"ui-slider-range-min ui-slider-range-max"),this.range.css({left:"",bottom:""})):(this.range=t("<div>").appendTo(this.element),this._addClass(this.range,"ui-slider-range")),("min"===e.range||"max"===e.range)&&this._addClass(this.range,"ui-slider-range-"+e.range)):(this.range&&this.range.remove(),this.range=null)},_setupEvents:function(){this._off(this.handles),this._on(this.handles,this._handleEvents),this._hoverable(this.handles),this._focusable(this.handles)},_destroy:function(){this.handles.remove(),this.range&&this.range.remove(),this._mouseDestroy()},_mouseCapture:function(e){var i,s,n,o,a,r,l,h,c=this,u=this.options;return u.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),i={x:e.pageX,y:e.pageY},s=this._normValueFromMouse(i),n=this._valueMax()-this._valueMin()+1,this.handles.each(function(e){var i=Math.abs(s-c.values(e));(n>i||n===i&&(e===c._lastChangedValue||c.values(e)===u.min))&&(n=i,o=t(this),a=e)}),r=this._start(e,a),r===!1?!1:(this._mouseSliding=!0,this._handleIndex=a,this._addClass(o,null,"ui-state-active"),o.trigger("focus"),l=o.offset(),h=!t(e.target).parents().addBack().is(".ui-slider-handle"),this._clickOffset=h?{left:0,top:0}:{left:e.pageX-l.left-o.width()/2,top:e.pageY-l.top-o.height()/2-(parseInt(o.css("borderTopWidth"),10)||0)-(parseInt(o.css("borderBottomWidth"),10)||0)+(parseInt(o.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(e,a,s),this._animateOff=!0,!0))},_mouseStart:function(){return!0},_mouseDrag:function(t){var e={x:t.pageX,y:t.pageY},i=this._normValueFromMouse(e);return this._slide(t,this._handleIndex,i),!1},_mouseStop:function(t){return this._removeClass(this.handles,null,"ui-state-active"),this._mouseSliding=!1,this._stop(t,this._handleIndex),this._change(t,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation="vertical"===this.options.orientation?"vertical":"horizontal"},_normValueFromMouse:function(t){var e,i,s,n,o;return"horizontal"===this.orientation?(e=this.elementSize.width,i=t.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(e=this.elementSize.height,i=t.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),s=i/e,s>1&&(s=1),0>s&&(s=0),"vertical"===this.orientation&&(s=1-s),n=this._valueMax()-this._valueMin(),o=this._valueMin()+s*n,this._trimAlignValue(o)},_uiHash:function(t,e,i){var s={handle:this.handles[t],handleIndex:t,value:void 0!==e?e:this.value()};return this._hasMultipleValues()&&(s.value=void 0!==e?e:this.values(t),s.values=i||this.values()),s},_hasMultipleValues:function(){return this.options.values&&this.options.values.length},_start:function(t,e){return this._trigger("start",t,this._uiHash(e))},_slide:function(t,e,i){var s,n,o=this.value(),a=this.values();this._hasMultipleValues()&&(n=this.values(e?0:1),o=this.values(e),2===this.options.values.length&&this.options.range===!0&&(i=0===e?Math.min(n,i):Math.max(n,i)),a[e]=i),i!==o&&(s=this._trigger("slide",t,this._uiHash(e,i,a)),s!==!1&&(this._hasMultipleValues()?this.values(e,i):this.value(i)))},_stop:function(t,e){this._trigger("stop",t,this._uiHash(e))},_change:function(t,e){this._keySliding||this._mouseSliding||(this._lastChangedValue=e,this._trigger("change",t,this._uiHash(e)))},value:function(t){return arguments.length?(this.options.value=this._trimAlignValue(t),this._refreshValue(),this._change(null,0),void 0):this._value()},values:function(e,i){var s,n,o;if(arguments.length>1)return this.options.values[e]=this._trimAlignValue(i),this._refreshValue(),this._change(null,e),void 0;if(!arguments.length)return this._values();if(!t.isArray(arguments[0]))return this._hasMultipleValues()?this._values(e):this.value();for(s=this.options.values,n=arguments[0],o=0;s.length>o;o+=1)s[o]=this._trimAlignValue(n[o]),this._change(null,o);this._refreshValue()},_setOption:function(e,i){var s,n=0;switch("range"===e&&this.options.range===!0&&("min"===i?(this.options.value=this._values(0),this.options.values=null):"max"===i&&(this.options.value=this._values(this.options.values.length-1),this.options.values=null)),t.isArray(this.options.values)&&(n=this.options.values.length),this._super(e,i),e){case"orientation":this._detectOrientation(),this._removeClass("ui-slider-horizontal ui-slider-vertical")._addClass("ui-slider-"+this.orientation),this._refreshValue(),this.options.range&&this._refreshRange(i),this.handles.css("horizontal"===i?"bottom":"left","");break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":for(this._animateOff=!0,this._refreshValue(),s=n-1;s>=0;s--)this._change(null,s);this._animateOff=!1;break;case"step":case"min":case"max":this._animateOff=!0,this._calculateNewMax(),this._refreshValue(),this._animateOff=!1;break;case"range":this._animateOff=!0,this._refresh(),this._animateOff=!1}},_setOptionDisabled:function(t){this._super(t),this._toggleClass(null,"ui-state-disabled",!!t)},_value:function(){var t=this.options.value;return t=this._trimAlignValue(t)},_values:function(t){var e,i,s;if(arguments.length)return e=this.options.values[t],e=this._trimAlignValue(e);if(this._hasMultipleValues()){for(i=this.options.values.slice(),s=0;i.length>s;s+=1)i[s]=this._trimAlignValue(i[s]);return i}return[]},_trimAlignValue:function(t){if(this._valueMin()>=t)return this._valueMin();if(t>=this._valueMax())return this._valueMax();var e=this.options.step>0?this.options.step:1,i=(t-this._valueMin())%e,s=t-i;return 2*Math.abs(i)>=e&&(s+=i>0?e:-e),parseFloat(s.toFixed(5))},_calculateNewMax:function(){var t=this.options.max,e=this._valueMin(),i=this.options.step,s=Math.round((t-e)/i)*i;t=s+e,t>this.options.max&&(t-=i),this.max=parseFloat(t.toFixed(this._precision()))},_precision:function(){var t=this._precisionOf(this.options.step);return null!==this.options.min&&(t=Math.max(t,this._precisionOf(this.options.min))),t},_precisionOf:function(t){var e=""+t,i=e.indexOf(".");return-1===i?0:e.length-i-1},_valueMin:function(){return this.options.min},_valueMax:function(){return this.max},_refreshRange:function(t){"vertical"===t&&this.range.css({width:"",left:""}),"horizontal"===t&&this.range.css({height:"",bottom:""})},_refreshValue:function(){var e,i,s,n,o,a=this.options.range,r=this.options,l=this,h=this._animateOff?!1:r.animate,c={};this._hasMultipleValues()?this.handles.each(function(s){i=100*((l.values(s)-l._valueMin())/(l._valueMax()-l._valueMin())),c["horizontal"===l.orientation?"left":"bottom"]=i+"%",t(this).stop(1,1)[h?"animate":"css"](c,r.animate),l.options.range===!0&&("horizontal"===l.orientation?(0===s&&l.range.stop(1,1)[h?"animate":"css"]({left:i+"%"},r.animate),1===s&&l.range[h?"animate":"css"]({width:i-e+"%"},{queue:!1,duration:r.animate})):(0===s&&l.range.stop(1,1)[h?"animate":"css"]({bottom:i+"%"},r.animate),1===s&&l.range[h?"animate":"css"]({height:i-e+"%"},{queue:!1,duration:r.animate}))),e=i}):(s=this.value(),n=this._valueMin(),o=this._valueMax(),i=o!==n?100*((s-n)/(o-n)):0,c["horizontal"===this.orientation?"left":"bottom"]=i+"%",this.handle.stop(1,1)[h?"animate":"css"](c,r.animate),"min"===a&&"horizontal"===this.orientation&&this.range.stop(1,1)[h?"animate":"css"]({width:i+"%"},r.animate),"max"===a&&"horizontal"===this.orientation&&this.range.stop(1,1)[h?"animate":"css"]({width:100-i+"%"},r.animate),"min"===a&&"vertical"===this.orientation&&this.range.stop(1,1)[h?"animate":"css"]({height:i+"%"},r.animate),"max"===a&&"vertical"===this.orientation&&this.range.stop(1,1)[h?"animate":"css"]({height:100-i+"%"},r.animate))},_handleEvents:{keydown:function(e){var i,s,n,o,a=t(e.target).data("ui-slider-handle-index");switch(e.keyCode){case t.ui.keyCode.HOME:case t.ui.keyCode.END:case t.ui.keyCode.PAGE_UP:case t.ui.keyCode.PAGE_DOWN:case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:if(e.preventDefault(),!this._keySliding&&(this._keySliding=!0,this._addClass(t(e.target),null,"ui-state-active"),i=this._start(e,a),i===!1))return}switch(o=this.options.step,s=n=this._hasMultipleValues()?this.values(a):this.value(),e.keyCode){case t.ui.keyCode.HOME:n=this._valueMin();break;case t.ui.keyCode.END:n=this._valueMax();break;case t.ui.keyCode.PAGE_UP:n=this._trimAlignValue(s+(this._valueMax()-this._valueMin())/this.numPages);break;case t.ui.keyCode.PAGE_DOWN:n=this._trimAlignValue(s-(this._valueMax()-this._valueMin())/this.numPages);break;case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:if(s===this._valueMax())return;n=this._trimAlignValue(s+o);break;case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:if(s===this._valueMin())return;n=this._trimAlignValue(s-o)}this._slide(e,a,n)},keyup:function(e){var i=t(e.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(e,i),this._change(e,i),this._removeClass(t(e.target),null,"ui-state-active"))}}});var n="ui-effects-",o="ui-effects-style",a="ui-effects-animated",r=t;t.effects={effect:{}},function(t,e){function i(t,e,i){var s=u[e.type]||{};return null==t?i||!e.def?null:e.def:(t=s.floor?~~t:parseFloat(t),isNaN(t)?e.def:s.mod?(t+s.mod)%s.mod:0>t?0:t>s.max?s.max:t)}function s(i){var s=h(),n=s._rgba=[];return i=i.toLowerCase(),f(l,function(t,o){var a,r=o.re.exec(i),l=r&&o.parse(r),h=o.space||"rgba";return l?(a=s[h](l),s[c[h].cache]=a[c[h].cache],n=s._rgba=a._rgba,!1):e}),n.length?("0,0,0,0"===n.join()&&t.extend(n,o.transparent),s):o[i]}function n(t,e,i){return i=(i+1)%1,1>6*i?t+6*(e-t)*i:1>2*i?e:2>3*i?t+6*(e-t)*(2/3-i):t}var o,a="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",r=/^([\-+])=\s*(\d+\.?\d*)/,l=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[t[1],t[2],t[3],t[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[2.55*t[1],2.55*t[2],2.55*t[3],t[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(t){return[t[1],t[2]/100,t[3]/100,t[4]]}}],h=t.Color=function(e,i,s,n){return new t.Color.fn.parse(e,i,s,n)},c={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},u={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},d=h.support={},p=t("<p>")[0],f=t.each;p.style.cssText="background-color:rgba(1,1,1,.5)",d.rgba=p.style.backgroundColor.indexOf("rgba")>-1,f(c,function(t,e){e.cache="_"+t,e.props.alpha={idx:3,type:"percent",def:1}}),h.fn=t.extend(h.prototype,{parse:function(n,a,r,l){if(n===e)return this._rgba=[null,null,null,null],this;(n.jquery||n.nodeType)&&(n=t(n).css(a),a=e);var u=this,d=t.type(n),p=this._rgba=[];return a!==e&&(n=[n,a,r,l],d="array"),"string"===d?this.parse(s(n)||o._default):"array"===d?(f(c.rgba.props,function(t,e){p[e.idx]=i(n[e.idx],e)}),this):"object"===d?(n instanceof h?f(c,function(t,e){n[e.cache]&&(u[e.cache]=n[e.cache].slice())}):f(c,function(e,s){var o=s.cache;f(s.props,function(t,e){if(!u[o]&&s.to){if("alpha"===t||null==n[t])return;u[o]=s.to(u._rgba)}u[o][e.idx]=i(n[t],e,!0)}),u[o]&&0>t.inArray(null,u[o].slice(0,3))&&(u[o][3]=1,s.from&&(u._rgba=s.from(u[o])))}),this):e},is:function(t){var i=h(t),s=!0,n=this;return f(c,function(t,o){var a,r=i[o.cache];return r&&(a=n[o.cache]||o.to&&o.to(n._rgba)||[],f(o.props,function(t,i){return null!=r[i.idx]?s=r[i.idx]===a[i.idx]:e})),s}),s},_space:function(){var t=[],e=this;return f(c,function(i,s){e[s.cache]&&t.push(i)}),t.pop()},transition:function(t,e){var s=h(t),n=s._space(),o=c[n],a=0===this.alpha()?h("transparent"):this,r=a[o.cache]||o.to(a._rgba),l=r.slice();return s=s[o.cache],f(o.props,function(t,n){var o=n.idx,a=r[o],h=s[o],c=u[n.type]||{};null!==h&&(null===a?l[o]=h:(c.mod&&(h-a>c.mod/2?a+=c.mod:a-h>c.mod/2&&(a-=c.mod)),l[o]=i((h-a)*e+a,n)))}),this[n](l)},blend:function(e){if(1===this._rgba[3])return this;var i=this._rgba.slice(),s=i.pop(),n=h(e)._rgba;return h(t.map(i,function(t,e){return(1-s)*n[e]+s*t}))},toRgbaString:function(){var e="rgba(",i=t.map(this._rgba,function(t,e){return null==t?e>2?1:0:t});return 1===i[3]&&(i.pop(),e="rgb("),e+i.join()+")"},toHslaString:function(){var e="hsla(",i=t.map(this.hsla(),function(t,e){return null==t&&(t=e>2?1:0),e&&3>e&&(t=Math.round(100*t)+"%"),t});return 1===i[3]&&(i.pop(),e="hsl("),e+i.join()+")"},toHexString:function(e){var i=this._rgba.slice(),s=i.pop();return e&&i.push(~~(255*s)),"#"+t.map(i,function(t){return t=(t||0).toString(16),1===t.length?"0"+t:t}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),h.fn.parse.prototype=h.fn,c.hsla.to=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e,i,s=t[0]/255,n=t[1]/255,o=t[2]/255,a=t[3],r=Math.max(s,n,o),l=Math.min(s,n,o),h=r-l,c=r+l,u=.5*c;return e=l===r?0:s===r?60*(n-o)/h+360:n===r?60*(o-s)/h+120:60*(s-n)/h+240,i=0===h?0:.5>=u?h/c:h/(2-c),[Math.round(e)%360,i,u,null==a?1:a]},c.hsla.from=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e=t[0]/360,i=t[1],s=t[2],o=t[3],a=.5>=s?s*(1+i):s+i-s*i,r=2*s-a;return[Math.round(255*n(r,a,e+1/3)),Math.round(255*n(r,a,e)),Math.round(255*n(r,a,e-1/3)),o]},f(c,function(s,n){var o=n.props,a=n.cache,l=n.to,c=n.from;h.fn[s]=function(s){if(l&&!this[a]&&(this[a]=l(this._rgba)),s===e)return this[a].slice();var n,r=t.type(s),u="array"===r||"object"===r?s:arguments,d=this[a].slice();return f(o,function(t,e){var s=u["object"===r?t:e.idx];null==s&&(s=d[e.idx]),d[e.idx]=i(s,e)}),c?(n=h(c(d)),n[a]=d,n):h(d)},f(o,function(e,i){h.fn[e]||(h.fn[e]=function(n){var o,a=t.type(n),l="alpha"===e?this._hsla?"hsla":"rgba":s,h=this[l](),c=h[i.idx];return"undefined"===a?c:("function"===a&&(n=n.call(this,c),a=t.type(n)),null==n&&i.empty?this:("string"===a&&(o=r.exec(n),o&&(n=c+parseFloat(o[2])*("+"===o[1]?1:-1))),h[i.idx]=n,this[l](h)))})})}),h.hook=function(e){var i=e.split(" ");f(i,function(e,i){t.cssHooks[i]={set:function(e,n){var o,a,r="";if("transparent"!==n&&("string"!==t.type(n)||(o=s(n)))){if(n=h(o||n),!d.rgba&&1!==n._rgba[3]){for(a="backgroundColor"===i?e.parentNode:e;(""===r||"transparent"===r)&&a&&a.style;)try{r=t.css(a,"backgroundColor"),a=a.parentNode}catch(l){}n=n.blend(r&&"transparent"!==r?r:"_default")}n=n.toRgbaString()}try{e.style[i]=n}catch(l){}}},t.fx.step[i]=function(e){e.colorInit||(e.start=h(e.elem,i),e.end=h(e.end),e.colorInit=!0),t.cssHooks[i].set(e.elem,e.start.transition(e.end,e.pos))}})},h.hook(a),t.cssHooks.borderColor={expand:function(t){var e={};return f(["Top","Right","Bottom","Left"],function(i,s){e["border"+s+"Color"]=t}),e}},o=t.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(r),function(){function e(e){var i,s,n=e.ownerDocument.defaultView?e.ownerDocument.defaultView.getComputedStyle(e,null):e.currentStyle,o={};if(n&&n.length&&n[0]&&n[n[0]])for(s=n.length;s--;)i=n[s],"string"==typeof n[i]&&(o[t.camelCase(i)]=n[i]);else for(i in n)"string"==typeof n[i]&&(o[i]=n[i]);return o}function i(e,i){var s,o,a={};for(s in i)o=i[s],e[s]!==o&&(n[s]||(t.fx.step[s]||!isNaN(parseFloat(o)))&&(a[s]=o));return a}var s=["add","remove","toggle"],n={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};t.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(e,i){t.fx.step[i]=function(t){("none"!==t.end&&!t.setAttr||1===t.pos&&!t.setAttr)&&(r.style(t.elem,i,t.end),t.setAttr=!0)}}),t.fn.addBack||(t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t.effects.animateClass=function(n,o,a,r){var l=t.speed(o,a,r);return this.queue(function(){var o,a=t(this),r=a.attr("class")||"",h=l.children?a.find("*").addBack():a;h=h.map(function(){var i=t(this);return{el:i,start:e(this)}}),o=function(){t.each(s,function(t,e){n[e]&&a[e+"Class"](n[e])})},o(),h=h.map(function(){return this.end=e(this.el[0]),this.diff=i(this.start,this.end),this}),a.attr("class",r),h=h.map(function(){var e=this,i=t.Deferred(),s=t.extend({},l,{queue:!1,complete:function(){i.resolve(e)}});return this.el.animate(this.diff,s),i.promise()}),t.when.apply(t,h.get()).done(function(){o(),t.each(arguments,function(){var e=this.el;t.each(this.diff,function(t){e.css(t,"")})}),l.complete.call(a[0])})})},t.fn.extend({addClass:function(e){return function(i,s,n,o){return s?t.effects.animateClass.call(this,{add:i},s,n,o):e.apply(this,arguments)}}(t.fn.addClass),removeClass:function(e){return function(i,s,n,o){return arguments.length>1?t.effects.animateClass.call(this,{remove:i},s,n,o):e.apply(this,arguments)}}(t.fn.removeClass),toggleClass:function(e){return function(i,s,n,o,a){return"boolean"==typeof s||void 0===s?n?t.effects.animateClass.call(this,s?{add:i}:{remove:i},n,o,a):e.apply(this,arguments):t.effects.animateClass.call(this,{toggle:i},s,n,o)}}(t.fn.toggleClass),switchClass:function(e,i,s,n,o){return t.effects.animateClass.call(this,{add:i,remove:e},s,n,o)}})}(),function(){function e(e,i,s,n){return t.isPlainObject(e)&&(i=e,e=e.effect),e={effect:e},null==i&&(i={}),t.isFunction(i)&&(n=i,s=null,i={}),("number"==typeof i||t.fx.speeds[i])&&(n=s,s=i,i={}),t.isFunction(s)&&(n=s,s=null),i&&t.extend(e,i),s=s||i.duration,e.duration=t.fx.off?0:"number"==typeof s?s:s in t.fx.speeds?t.fx.speeds[s]:t.fx.speeds._default,e.complete=n||i.complete,e}function i(e){return!e||"number"==typeof e||t.fx.speeds[e]?!0:"string"!=typeof e||t.effects.effect[e]?t.isFunction(e)?!0:"object"!=typeof e||e.effect?!1:!0:!0}function s(t,e){var i=e.outerWidth(),s=e.outerHeight(),n=/^rect\((-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto)\)$/,o=n.exec(t)||["",0,i,s,0];return{top:parseFloat(o[1])||0,right:"auto"===o[2]?i:parseFloat(o[2]),bottom:"auto"===o[3]?s:parseFloat(o[3]),left:parseFloat(o[4])||0}}t.expr&&t.expr.filters&&t.expr.filters.animated&&(t.expr.filters.animated=function(e){return function(i){return!!t(i).data(a)||e(i)}}(t.expr.filters.animated)),t.uiBackCompat!==!1&&t.extend(t.effects,{save:function(t,e){for(var i=0,s=e.length;s>i;i++)null!==e[i]&&t.data(n+e[i],t[0].style[e[i]])
},restore:function(t,e){for(var i,s=0,o=e.length;o>s;s++)null!==e[s]&&(i=t.data(n+e[s]),t.css(e[s],i))},setMode:function(t,e){return"toggle"===e&&(e=t.is(":hidden")?"show":"hide"),e},createWrapper:function(e){if(e.parent().is(".ui-effects-wrapper"))return e.parent();var i={width:e.outerWidth(!0),height:e.outerHeight(!0),"float":e.css("float")},s=t("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),n={width:e.width(),height:e.height()},o=document.activeElement;try{o.id}catch(a){o=document.body}return e.wrap(s),(e[0]===o||t.contains(e[0],o))&&t(o).trigger("focus"),s=e.parent(),"static"===e.css("position")?(s.css({position:"relative"}),e.css({position:"relative"})):(t.extend(i,{position:e.css("position"),zIndex:e.css("z-index")}),t.each(["top","left","bottom","right"],function(t,s){i[s]=e.css(s),isNaN(parseInt(i[s],10))&&(i[s]="auto")}),e.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),e.css(n),s.css(i).show()},removeWrapper:function(e){var i=document.activeElement;return e.parent().is(".ui-effects-wrapper")&&(e.parent().replaceWith(e),(e[0]===i||t.contains(e[0],i))&&t(i).trigger("focus")),e}}),t.extend(t.effects,{version:"1.12.1",define:function(e,i,s){return s||(s=i,i="effect"),t.effects.effect[e]=s,t.effects.effect[e].mode=i,s},scaledDimensions:function(t,e,i){if(0===e)return{height:0,width:0,outerHeight:0,outerWidth:0};var s="horizontal"!==i?(e||100)/100:1,n="vertical"!==i?(e||100)/100:1;return{height:t.height()*n,width:t.width()*s,outerHeight:t.outerHeight()*n,outerWidth:t.outerWidth()*s}},clipToBox:function(t){return{width:t.clip.right-t.clip.left,height:t.clip.bottom-t.clip.top,left:t.clip.left,top:t.clip.top}},unshift:function(t,e,i){var s=t.queue();e>1&&s.splice.apply(s,[1,0].concat(s.splice(e,i))),t.dequeue()},saveStyle:function(t){t.data(o,t[0].style.cssText)},restoreStyle:function(t){t[0].style.cssText=t.data(o)||"",t.removeData(o)},mode:function(t,e){var i=t.is(":hidden");return"toggle"===e&&(e=i?"show":"hide"),(i?"hide"===e:"show"===e)&&(e="none"),e},getBaseline:function(t,e){var i,s;switch(t[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=t[0]/e.height}switch(t[1]){case"left":s=0;break;case"center":s=.5;break;case"right":s=1;break;default:s=t[1]/e.width}return{x:s,y:i}},createPlaceholder:function(e){var i,s=e.css("position"),o=e.position();return e.css({marginTop:e.css("marginTop"),marginBottom:e.css("marginBottom"),marginLeft:e.css("marginLeft"),marginRight:e.css("marginRight")}).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()),/^(static|relative)/.test(s)&&(s="absolute",i=t("<"+e[0].nodeName+">").insertAfter(e).css({display:/^(inline|ruby)/.test(e.css("display"))?"inline-block":"block",visibility:"hidden",marginTop:e.css("marginTop"),marginBottom:e.css("marginBottom"),marginLeft:e.css("marginLeft"),marginRight:e.css("marginRight"),"float":e.css("float")}).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()).addClass("ui-effects-placeholder"),e.data(n+"placeholder",i)),e.css({position:s,left:o.left,top:o.top}),i},removePlaceholder:function(t){var e=n+"placeholder",i=t.data(e);i&&(i.remove(),t.removeData(e))},cleanUp:function(e){t.effects.restoreStyle(e),t.effects.removePlaceholder(e)},setTransition:function(e,i,s,n){return n=n||{},t.each(i,function(t,i){var o=e.cssUnit(i);o[0]>0&&(n[i]=o[0]*s+o[1])}),n}}),t.fn.extend({effect:function(){function i(e){function i(){l.removeData(a),t.effects.cleanUp(l),"hide"===s.mode&&l.hide(),r()}function r(){t.isFunction(h)&&h.call(l[0]),t.isFunction(e)&&e()}var l=t(this);s.mode=u.shift(),t.uiBackCompat===!1||o?"none"===s.mode?(l[c](),r()):n.call(l[0],s,i):(l.is(":hidden")?"hide"===c:"show"===c)?(l[c](),r()):n.call(l[0],s,r)}var s=e.apply(this,arguments),n=t.effects.effect[s.effect],o=n.mode,r=s.queue,l=r||"fx",h=s.complete,c=s.mode,u=[],d=function(e){var i=t(this),s=t.effects.mode(i,c)||o;i.data(a,!0),u.push(s),o&&("show"===s||s===o&&"hide"===s)&&i.show(),o&&"none"===s||t.effects.saveStyle(i),t.isFunction(e)&&e()};return t.fx.off||!n?c?this[c](s.duration,h):this.each(function(){h&&h.call(this)}):r===!1?this.each(d).each(i):this.queue(l,d).queue(l,i)},show:function(t){return function(s){if(i(s))return t.apply(this,arguments);var n=e.apply(this,arguments);return n.mode="show",this.effect.call(this,n)}}(t.fn.show),hide:function(t){return function(s){if(i(s))return t.apply(this,arguments);var n=e.apply(this,arguments);return n.mode="hide",this.effect.call(this,n)}}(t.fn.hide),toggle:function(t){return function(s){if(i(s)||"boolean"==typeof s)return t.apply(this,arguments);var n=e.apply(this,arguments);return n.mode="toggle",this.effect.call(this,n)}}(t.fn.toggle),cssUnit:function(e){var i=this.css(e),s=[];return t.each(["em","px","%","pt"],function(t,e){i.indexOf(e)>0&&(s=[parseFloat(i),e])}),s},cssClip:function(t){return t?this.css("clip","rect("+t.top+"px "+t.right+"px "+t.bottom+"px "+t.left+"px)"):s(this.css("clip"),this)},transfer:function(e,i){var s=t(this),n=t(e.to),o="fixed"===n.css("position"),a=t("body"),r=o?a.scrollTop():0,l=o?a.scrollLeft():0,h=n.offset(),c={top:h.top-r,left:h.left-l,height:n.innerHeight(),width:n.innerWidth()},u=s.offset(),d=t("<div class='ui-effects-transfer'></div>").appendTo("body").addClass(e.className).css({top:u.top-r,left:u.left-l,height:s.innerHeight(),width:s.innerWidth(),position:o?"fixed":"absolute"}).animate(c,e.duration,e.easing,function(){d.remove(),t.isFunction(i)&&i()})}}),t.fx.step.clip=function(e){e.clipInit||(e.start=t(e.elem).cssClip(),"string"==typeof e.end&&(e.end=s(e.end,e.elem)),e.clipInit=!0),t(e.elem).cssClip({top:e.pos*(e.end.top-e.start.top)+e.start.top,right:e.pos*(e.end.right-e.start.right)+e.start.right,bottom:e.pos*(e.end.bottom-e.start.bottom)+e.start.bottom,left:e.pos*(e.end.left-e.start.left)+e.start.left})}}(),function(){var e={};t.each(["Quad","Cubic","Quart","Quint","Expo"],function(t,i){e[i]=function(e){return Math.pow(e,t+2)}}),t.extend(e,{Sine:function(t){return 1-Math.cos(t*Math.PI/2)},Circ:function(t){return 1-Math.sqrt(1-t*t)},Elastic:function(t){return 0===t||1===t?t:-Math.pow(2,8*(t-1))*Math.sin((80*(t-1)-7.5)*Math.PI/15)},Back:function(t){return t*t*(3*t-2)},Bounce:function(t){for(var e,i=4;((e=Math.pow(2,--i))-1)/11>t;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*e-2)/22-t,2)}}),t.each(e,function(e,i){t.easing["easeIn"+e]=i,t.easing["easeOut"+e]=function(t){return 1-i(1-t)},t.easing["easeInOut"+e]=function(t){return.5>t?i(2*t)/2:1-i(-2*t+2)/2}})}(),t.effects,t.effects.define("slide","show",function(e,i){var s,n,o=t(this),a={up:["bottom","top"],down:["top","bottom"],left:["right","left"],right:["left","right"]},r=e.mode,l=e.direction||"left",h="up"===l||"down"===l?"top":"left",c="up"===l||"left"===l,u=e.distance||o["top"===h?"outerHeight":"outerWidth"](!0),d={};t.effects.createPlaceholder(o),s=o.cssClip(),n=o.position()[h],d[h]=(c?-1:1)*u+n,d.clip=o.cssClip(),d.clip[a[l][1]]=d.clip[a[l][0]],"show"===r&&(o.cssClip(d.clip),o.css(h,d[h]),d.clip=s,d[h]=n),o.animate(d,{queue:!1,duration:e.duration,easing:e.easing,complete:i})})});

/*!
 * fullPage 2.9.4
 * https://github.com/alvarotrigo/fullPage.js
 * @license MIT licensed
 *
 * Copyright (C) 2015 alvarotrigo.com - A project by Alvaro Trigo
 */
!function(e,n){"use strict";"function"==typeof define&&define.amd?define(["jquery"],function(t){return n(t,e,e.document,e.Math)}):"object"==typeof exports&&exports?module.exports=n(require("jquery"),e,e.document,e.Math):n(jQuery,e,e.document,e.Math)}("undefined"!=typeof window?window:this,function(e,n,t,o,i){"use strict";var a="fullpage-wrapper",r="."+a,l="fp-scrollable",s="."+l,c="fp-responsive",d="fp-notransition",f="fp-destroyed",u="fp-enabled",h="fp-viewing",p="active",v="."+p,g="fp-completely",m="."+g,w=".section",S="fp-section",y="."+S,b=y+v,x=y+":first",C=y+":last",T="fp-tableCell",k="."+T,I="fp-auto-height",L="fp-normal-scroll",E="fp-nav",M="#"+E,O="fp-tooltip",A="."+O,R="fp-show-active",H=".slide",B="fp-slide",z="."+B,D=z+v,P="fp-slides",q="."+P,F="fp-slidesContainer",V="."+F,W="fp-table",U="fp-slidesNav",Y="."+U,j=Y+" a",N="fp-controlArrow",X="."+N,K="fp-prev",Q="."+K,G=N+" "+K,J=X+Q,Z="fp-next",$="."+Z,_=N+" "+Z,ee=X+$,ne=e(n),te=e(t),oe={scrollbars:!0,mouseWheel:!0,hideScrollbars:!1,fadeScrollbars:!1,disableMouse:!0,interactiveScrollbars:!0};e.fn.fullpage=function(l){function s(n,t){n||nt(0),rt("autoScrolling",n,t);var o=e(b);l.autoScrolling&&!l.scrollBar?(ct.css({overflow:"hidden",height:"100%"}),N(Bt.recordHistory,"internal"),St.css({"-ms-touch-action":"none","touch-action":"none"}),o.length&&nt(o.position().top)):(ct.css({overflow:"visible",height:"initial"}),N(!1,"internal"),St.css({"-ms-touch-action":"","touch-action":""}),o.length&&ct.scrollTop(o.position().top))}function N(e,n){rt("recordHistory",e,n)}function Q(e,n){rt("scrollingSpeed",e,n)}function Z(e,n){rt("fitToSection",e,n)}function $(e){l.lockAnchors=e}function ae(e){e?(Kn(),Qn()):(Xn(),Gn())}function re(n,t){"undefined"!=typeof t?(t=t.replace(/ /g,"").split(","),e.each(t,function(e,t){ot(n,t,"m")})):n?(ae(!0),Jn()):(ae(!1),Zn())}function le(n,t){"undefined"!=typeof t?(t=t.replace(/ /g,"").split(","),e.each(t,function(e,t){ot(n,t,"k")})):l.keyboardScrolling=n}function se(){var n=e(b).prev(y);n.length||!l.loopTop&&!l.continuousVertical||(n=e(y).last()),n.length&&Ke(n,null,!0)}function ce(){var n=e(b).next(y);n.length||!l.loopBottom&&!l.continuousVertical||(n=e(y).first()),n.length&&Ke(n,null,!1)}function de(e,n){Q(0,"internal"),fe(e,n),Q(Bt.scrollingSpeed,"internal")}function fe(e,n){var t=Dn(e);"undefined"!=typeof n?qn(e,n):t.length>0&&Ke(t)}function ue(e){je("right",e)}function he(e){je("left",e)}function pe(n){if(!St.hasClass(f)){bt=!0,yt=ne.height(),e(y).each(function(){var n=e(this).find(q),t=e(this).find(z);l.verticalCentered&&e(this).find(k).css("height",Bn(e(this))+"px"),e(this).css("height",yt+"px"),l.scrollOverflow&&(t.length?t.each(function(){Rn(e(this))}):Rn(e(this))),t.length>1&&Sn(n,n.find(D))});var t=e(b),o=t.index(y);o&&de(o+1),bt=!1,e.isFunction(l.afterResize)&&n&&l.afterResize.call(St),e.isFunction(l.afterReBuild)&&!n&&l.afterReBuild.call(St)}}function ve(n){var t=dt.hasClass(c);n?t||(s(!1,"internal"),Z(!1,"internal"),e(M).hide(),dt.addClass(c),e.isFunction(l.afterResponsive)&&l.afterResponsive.call(St,n)):t&&(s(Bt.autoScrolling,"internal"),Z(Bt.autoScrolling,"internal"),e(M).show(),dt.removeClass(c),e.isFunction(l.afterResponsive)&&l.afterResponsive.call(St,n))}function ge(){l.css3&&(l.css3=Nn()),l.scrollBar=l.scrollBar||l.hybrid,we(),Se(),re(!0),s(l.autoScrolling,"internal"),Tn(),jn(),"complete"===t.readyState&&rn(),ne.on("load",rn)}function me(){ne.on("scroll",Re).on("hashchange",ln).blur(pn).resize(Cn),te.keydown(sn).keyup(dn).on("click touchstart",M+" a",vn).on("click touchstart",j,gn).on("click",A,cn),e(y).on("click touchstart",X,hn),l.normalScrollElements&&(te.on("mouseenter",l.normalScrollElements,function(){ae(!1)}),te.on("mouseleave",l.normalScrollElements,function(){ae(!0)}))}function we(){var n=St.find(l.sectionSelector);l.anchors.length||(l.anchors=n.filter("[data-anchor]").map(function(){return e(this).data("anchor").toString()}).get()),l.navigationTooltips.length||(l.navigationTooltips=n.filter("[data-tooltip]").map(function(){return e(this).data("tooltip").toString()}).get())}function Se(){St.css({height:"100%",position:"relative"}),St.addClass(a),e("html").addClass(u),yt=ne.height(),St.removeClass(f),Ce(),e(y).each(function(n){var t=e(this),o=t.find(z),i=o.length;be(t,n),xe(t,n),i>0?ye(t,o,i):l.verticalCentered&&Hn(t)}),l.fixedElements&&l.css3&&e(l.fixedElements).appendTo(dt),l.navigation&&ke(),Le(),l.scrollOverflow?("complete"===t.readyState&&Ie(),ne.on("load",Ie)):Oe()}function ye(n,t,o){var i=100*o,a=100/o;t.wrapAll('<div class="'+F+'" />'),t.parent().wrap('<div class="'+P+'" />'),n.find(V).css("width",i+"%"),o>1&&(l.controlArrows&&Te(n),l.slidesNavigation&&Vn(n,o)),t.each(function(n){e(this).css("width",a+"%"),l.verticalCentered&&Hn(e(this))});var r=n.find(D);r.length&&(0!==e(b).index(y)||0===e(b).index(y)&&0!==r.index())?et(r,"internal"):t.eq(0).addClass(p)}function be(n,t){t||0!==e(b).length||n.addClass(p),vt=e(b),n.css("height",yt+"px"),l.paddingTop&&n.css("padding-top",l.paddingTop),l.paddingBottom&&n.css("padding-bottom",l.paddingBottom),"undefined"!=typeof l.sectionsColor[t]&&n.css("background-color",l.sectionsColor[t]),"undefined"!=typeof l.anchors[t]&&n.attr("data-anchor",l.anchors[t])}function xe(n,t){"undefined"!=typeof l.anchors[t]&&n.hasClass(p)&&Mn(l.anchors[t],t),l.menu&&l.css3&&e(l.menu).closest(r).length&&e(l.menu).appendTo(dt)}function Ce(){St.find(l.sectionSelector).addClass(S),St.find(l.slideSelector).addClass(B)}function Te(e){e.find(q).after('<div class="'+G+'"></div><div class="'+_+'"></div>'),"#fff"!=l.controlArrowColor&&(e.find(ee).css("border-color","transparent transparent transparent "+l.controlArrowColor),e.find(J).css("border-color","transparent "+l.controlArrowColor+" transparent transparent")),l.loopHorizontal||e.find(J).hide()}function ke(){dt.append('<div id="'+E+'"><ul></ul></div>');var n=e(M);n.addClass(function(){return l.showActiveTooltip?R+" "+l.navigationPosition:l.navigationPosition});for(var t=0;t<e(y).length;t++){var o="";l.anchors.length&&(o=l.anchors[t]);var i='<li><a href="#'+o+'"><span></span></a>',a=l.navigationTooltips[t];"undefined"!=typeof a&&""!==a&&(i+='<div class="'+O+" "+l.navigationPosition+'">'+a+"</div>"),i+="</li>",n.find("ul").append(i)}e(M).css("margin-top","-"+e(M).height()/2+"px"),e(M).find("li").eq(e(b).index(y)).find("a").addClass(p)}function Ie(){e(y).each(function(){var n=e(this).find(z);n.length?n.each(function(){Rn(e(this))}):Rn(e(this))}),Oe()}function Le(){St.find('iframe[src*="youtube.com/embed/"]').each(function(){Ee(e(this),"enablejsapi=1")})}function Ee(e,n){var t=e.attr("src");e.attr("src",t+Me(t)+n)}function Me(e){return/\?/.test(e)?"&":"?"}function Oe(){var n=e(b);n.addClass(g),l.scrollOverflowHandler.afterRender&&l.scrollOverflowHandler.afterRender(n),en(n),nn(n),l.scrollOverflowHandler.afterLoad(),Ae()&&e.isFunction(l.afterLoad)&&l.afterLoad.call(n,n.data("anchor"),n.index(y)+1),e.isFunction(l.afterRender)&&l.afterRender.call(St)}function Ae(){var e=n.location.hash.replace("#","").split("/"),t=Dn(decodeURIComponent(e[0]));return!t.length||t.length&&t.index()===vt.index()}function Re(){var n;if(!l.autoScrolling||l.scrollBar){var o=ne.scrollTop(),i=ze(o),a=0,r=o+ne.height()/2,s=dt.height()-ne.height()===o,c=t.querySelectorAll(y);if(s)a=c.length-1;else if(o)for(var d=0;d<c.length;++d){var f=c[d];f.offsetTop<=r&&(a=d)}else a=0;if(Be(i)&&(e(b).hasClass(g)||e(b).addClass(g).siblings().removeClass(g)),n=e(c).eq(a),!n.hasClass(p)){zt=!0;var u,h,v=e(b),m=v.index(y)+1,w=On(n),S=n.data("anchor"),x=n.index(y)+1,C=n.find(D);C.length&&(h=C.data("anchor"),u=C.index()),Ct&&(n.addClass(p).siblings().removeClass(p),e.isFunction(l.onLeave)&&l.onLeave.call(v,m,x,w),e.isFunction(l.afterLoad)&&l.afterLoad.call(n,S,x),on(v),en(n),nn(n),Mn(S,x-1),l.anchors.length&&(ut=S),Wn(u,h,S,x)),clearTimeout(Mt),Mt=setTimeout(function(){zt=!1},100)}l.fitToSection&&(clearTimeout(Ot),Ot=setTimeout(function(){l.fitToSection&&He()},l.fitToSectionDelay))}}function He(){Ct&&(bt=!0,Ke(e(b)),bt=!1)}function Be(n){var t=e(b).position().top,o=t+ne.height();return"up"==n?o>=ne.scrollTop()+ne.height():t<=ne.scrollTop()}function ze(e){var n=e>Dt?"down":"up";return Dt=e,Ut=e,n}function De(e,n){if(kt.m[e]){var t="down"===e?"bottom":"top",o="down"===e?ce:se;if(n.length>0){if(!l.scrollOverflowHandler.isScrolled(t,n))return!0;o()}else o()}}function Pe(e){var n=e.originalEvent;!Fe(e.target)&&l.autoScrolling&&Ve(n)&&e.preventDefault()}function qe(n){var t=n.originalEvent,i=e(t.target).closest(y);if(!Fe(n.target)&&Ve(t)){l.autoScrolling&&n.preventDefault();var a=l.scrollOverflowHandler.scrollable(i),r=_n(t);Ft=r.y,Vt=r.x,i.find(q).length&&o.abs(qt-Vt)>o.abs(Pt-Ft)?!gt&&o.abs(qt-Vt)>ne.outerWidth()/100*l.touchSensitivity&&(qt>Vt?kt.m.right&&ue(i):kt.m.left&&he(i)):l.autoScrolling&&Ct&&o.abs(Pt-Ft)>ne.height()/100*l.touchSensitivity&&(Pt>Ft?De("down",a):Ft>Pt&&De("up",a))}}function Fe(n,t){t=t||0;var o=e(n).parent();return t<l.normalScrollElementTouchThreshold&&o.is(l.normalScrollElements)?!0:t==l.normalScrollElementTouchThreshold?!1:Fe(o,++t)}function Ve(e){return"undefined"==typeof e.pointerType||"mouse"!=e.pointerType}function We(e){var n=e.originalEvent;if(l.fitToSection&&ct.stop(),Ve(n)){var t=_n(n);Pt=t.y,qt=t.x}}function Ue(e,n){for(var t=0,i=e.slice(o.max(e.length-n,1)),a=0;a<i.length;a++)t+=i[a];return o.ceil(t/n)}function Ye(t){var i=(new Date).getTime(),a=e(m).hasClass(L);if(l.autoScrolling&&!pt&&!a){t=t||n.event;var r=t.wheelDelta||-t.deltaY||-t.detail,s=o.max(-1,o.min(1,r)),c="undefined"!=typeof t.wheelDeltaX||"undefined"!=typeof t.deltaX,d=o.abs(t.wheelDeltaX)<o.abs(t.wheelDelta)||o.abs(t.deltaX)<o.abs(t.deltaY)||!c;Tt.length>149&&Tt.shift(),Tt.push(o.abs(r)),l.scrollBar&&(t.preventDefault?t.preventDefault():t.returnValue=!1);var f=e(b),u=l.scrollOverflowHandler.scrollable(f),h=i-Wt;if(Wt=i,h>200&&(Tt=[]),Ct){var p=Ue(Tt,10),v=Ue(Tt,70),g=p>=v;g&&d&&(0>s?De("down",u):De("up",u))}return!1}l.fitToSection&&ct.stop()}function je(n,t){var o="undefined"==typeof t?e(b):t,i=o.find(q),a=i.find(z).length;if(!(!i.length||gt||2>a)){var r=i.find(D),s=null;if(s="left"===n?r.prev(z):r.next(z),!s.length){if(!l.loopHorizontal)return;s="left"===n?r.siblings(":last"):r.siblings(":first")}gt=!0,Sn(i,s,n)}}function Ne(){e(D).each(function(){et(e(this),"internal")})}function Xe(e){var n=e.position(),t=n.top,o=n.top>Ut,i=t-yt+e.outerHeight(),a=l.bigSectionsDestination;return e.outerHeight()>yt?(!o&&!a||"bottom"===a)&&(t=i):(o||bt&&e.is(":last-child"))&&(t=i),Ut=t,t}function Ke(n,t,o){if("undefined"!=typeof n){var i,a,r=Xe(n),s={element:n,callback:t,isMovementUp:o,dtop:r,yMovement:On(n),anchorLink:n.data("anchor"),sectionIndex:n.index(y),activeSlide:n.find(D),activeSection:e(b),leavingSection:e(b).index(y)+1,localIsResizing:bt};s.activeSection.is(n)&&!bt||l.scrollBar&&ne.scrollTop()===s.dtop&&!n.hasClass(I)||(s.activeSlide.length&&(i=s.activeSlide.data("anchor"),a=s.activeSlide.index()),l.autoScrolling&&l.continuousVertical&&"undefined"!=typeof s.isMovementUp&&(!s.isMovementUp&&"up"==s.yMovement||s.isMovementUp&&"down"==s.yMovement)&&(s=Je(s)),(!e.isFunction(l.onLeave)||s.localIsResizing||l.onLeave.call(s.activeSection,s.leavingSection,s.sectionIndex+1,s.yMovement)!==!1)&&(s.localIsResizing||on(s.activeSection),l.scrollOverflowHandler.beforeLeave(),n.addClass(p).siblings().removeClass(p),en(n),l.scrollOverflowHandler.onLeave(),Ct=!1,Wn(a,i,s.anchorLink,s.sectionIndex),Qe(s),ut=s.anchorLink,Mn(s.anchorLink,s.sectionIndex)))}}function Qe(n){if(l.css3&&l.autoScrolling&&!l.scrollBar){var t="translate3d(0px, -"+o.round(n.dtop)+"px, 0px)";zn(t,!0),l.scrollingSpeed?(clearTimeout(Lt),Lt=setTimeout(function(){$e(n)},l.scrollingSpeed)):$e(n)}else{var i=Ge(n);e(i.element).animate(i.options,l.scrollingSpeed,l.easing).promise().done(function(){l.scrollBar?setTimeout(function(){$e(n)},30):$e(n)})}}function Ge(e){var n={};return l.autoScrolling&&!l.scrollBar?(n.options={top:-e.dtop},n.element=r):(n.options={scrollTop:e.dtop},n.element="html, body"),n}function Je(n){return n.isMovementUp?e(b).before(n.activeSection.nextAll(y)):e(b).after(n.activeSection.prevAll(y).get().reverse()),nt(e(b).position().top),Ne(),n.wrapAroundElements=n.activeSection,n.dtop=n.element.position().top,n.yMovement=On(n.element),n}function Ze(n){n.wrapAroundElements&&n.wrapAroundElements.length&&(n.isMovementUp?e(x).before(n.wrapAroundElements):e(C).after(n.wrapAroundElements),nt(e(b).position().top),Ne())}function $e(n){Ze(n),e.isFunction(l.afterLoad)&&!n.localIsResizing&&l.afterLoad.call(n.element,n.anchorLink,n.sectionIndex+1),l.scrollOverflowHandler.afterLoad(),n.localIsResizing||nn(n.element),n.element.addClass(g).siblings().removeClass(g),Ct=!0,e.isFunction(n.callback)&&n.callback.call(this)}function _e(e,n){e.attr(n,e.data(n)).removeAttr("data-"+n)}function en(n){if(l.lazyLoading){var t,o=an(n);o.find("img[data-src], img[data-srcset], source[data-src], audio[data-src], iframe[data-src]").each(function(){t=e(this),e.each(["src","srcset"],function(e,n){var o=t.attr("data-"+n);"undefined"!=typeof o&&o&&_e(t,n)}),t.is("source")&&t.closest("video").get(0).load()})}}function nn(n){var t=an(n);t.find("video, audio").each(function(){var n=e(this).get(0);n.hasAttribute("data-autoplay")&&"function"==typeof n.play&&n.play()}),t.find('iframe[src*="youtube.com/embed/"]').each(function(){var n=e(this).get(0);n.hasAttribute("data-autoplay")&&tn(n),n.onload=function(){n.hasAttribute("data-autoplay")&&tn(n)}})}function tn(e){e.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}',"*")}function on(n){var t=an(n);t.find("video, audio").each(function(){var n=e(this).get(0);n.hasAttribute("data-keepplaying")||"function"!=typeof n.pause||n.pause()}),t.find('iframe[src*="youtube.com/embed/"]').each(function(){var n=e(this).get(0);/youtube\.com\/embed\//.test(e(this).attr("src"))&&!n.hasAttribute("data-keepplaying")&&e(this).get(0).contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}',"*")})}function an(n){var t=n.find(D);return t.length&&(n=e(t)),n}function rn(){var e=n.location.hash.replace("#","").split("/"),t=decodeURIComponent(e[0]),o=decodeURIComponent(e[1]);t&&(l.animateAnchor?qn(t,o):de(t,o))}function ln(){if(!zt&&!l.lockAnchors){var e=n.location.hash.replace("#","").split("/"),t=decodeURIComponent(e[0]),o=decodeURIComponent(e[1]),i="undefined"==typeof ut,a="undefined"==typeof ut&&"undefined"==typeof o&&!gt;t.length&&(t&&t!==ut&&!i||a||!gt&&ht!=o)&&qn(t,o)}}function sn(n){clearTimeout(At);var t=e(":focus");if(!t.is("textarea")&&!t.is("input")&&!t.is("select")&&"true"!==t.attr("contentEditable")&&""!==t.attr("contentEditable")&&l.keyboardScrolling&&l.autoScrolling){var o=n.which,i=[40,38,32,33,34];e.inArray(o,i)>-1&&n.preventDefault(),pt=n.ctrlKey,At=setTimeout(function(){mn(n)},150)}}function cn(){e(this).prev().trigger("click")}function dn(e){xt&&(pt=e.ctrlKey)}function fn(e){2==e.which&&(Yt=e.pageY,St.on("mousemove",wn))}function un(e){2==e.which&&St.off("mousemove")}function hn(){var n=e(this).closest(y);e(this).hasClass(K)?kt.m.left&&he(n):kt.m.right&&ue(n)}function pn(){xt=!1,pt=!1}function vn(n){n.preventDefault();var t=e(this).parent().index();Ke(e(y).eq(t))}function gn(n){n.preventDefault();var t=e(this).closest(y).find(q),o=t.find(z).eq(e(this).closest("li").index());Sn(t,o)}function mn(n){var t=n.shiftKey;if(Ct||!([37,39].indexOf(n.which)<0))switch(n.which){case 38:case 33:kt.k.up&&se();break;case 32:if(t&&kt.k.up){se();break}case 40:case 34:kt.k.down&&ce();break;case 36:kt.k.up&&fe(1);break;case 35:kt.k.down&&fe(e(y).length);break;case 37:kt.k.left&&he();break;case 39:kt.k.right&&ue();break;default:return}}function wn(e){Ct&&(e.pageY<Yt&&kt.m.up?se():e.pageY>Yt&&kt.m.down&&ce()),Yt=e.pageY}function Sn(n,t,o){var i=n.closest(y),a={slides:n,destiny:t,direction:o,destinyPos:t.position(),slideIndex:t.index(),section:i,sectionIndex:i.index(y),anchorLink:i.data("anchor"),slidesNav:i.find(Y),slideAnchor:Yn(t),prevSlide:i.find(D),prevSlideIndex:i.find(D).index(),localIsResizing:bt};return a.xMovement=An(a.prevSlideIndex,a.slideIndex),a.localIsResizing||(Ct=!1),l.onSlideLeave&&!a.localIsResizing&&"none"!==a.xMovement&&e.isFunction(l.onSlideLeave)&&l.onSlideLeave.call(a.prevSlide,a.anchorLink,a.sectionIndex+1,a.prevSlideIndex,a.xMovement,a.slideIndex)===!1?void(gt=!1):(t.addClass(p).siblings().removeClass(p),a.localIsResizing||(on(a.prevSlide),en(t)),!l.loopHorizontal&&l.controlArrows&&(i.find(J).toggle(0!==a.slideIndex),i.find(ee).toggle(!t.is(":last-child"))),i.hasClass(p)&&!a.localIsResizing&&Wn(a.slideIndex,a.slideAnchor,a.anchorLink,a.sectionIndex),void bn(n,a,!0))}function yn(n){xn(n.slidesNav,n.slideIndex),n.localIsResizing||(e.isFunction(l.afterSlideLoad)&&l.afterSlideLoad.call(n.destiny,n.anchorLink,n.sectionIndex+1,n.slideAnchor,n.slideIndex),Ct=!0,nn(n.destiny)),gt=!1}function bn(e,n,t){var i=n.destinyPos;if(l.css3){var a="translate3d(-"+o.round(i.left)+"px, 0px, 0px)";kn(e.find(V)).css(tt(a)),Et=setTimeout(function(){t&&yn(n)},l.scrollingSpeed,l.easing)}else e.animate({scrollLeft:o.round(i.left)},l.scrollingSpeed,l.easing,function(){t&&yn(n)})}function xn(e,n){e.find(v).removeClass(p),e.find("li").eq(n).find("a").addClass(p)}function Cn(){if(Tn(),mt){var n=e(t.activeElement);if(!n.is("textarea")&&!n.is("input")&&!n.is("select")){var i=ne.height();o.abs(i-jt)>20*o.max(jt,i)/100&&(pe(!0),jt=i)}}else clearTimeout(It),It=setTimeout(function(){pe(!0)},350)}function Tn(){var e=l.responsive||l.responsiveWidth,n=l.responsiveHeight,t=e&&ne.outerWidth()<e,o=n&&ne.height()<n;e&&n?ve(t||o):e?ve(t):n&&ve(o)}function kn(e){var n="all "+l.scrollingSpeed+"ms "+l.easingcss3;return e.removeClass(d),e.css({"-webkit-transition":n,transition:n})}function In(e){return e.addClass(d)}function Ln(n,t){l.navigation&&(e(M).find(v).removeClass(p),n?e(M).find('a[href="#'+n+'"]').addClass(p):e(M).find("li").eq(t).find("a").addClass(p))}function En(n){l.menu&&(e(l.menu).find(v).removeClass(p),e(l.menu).find('[data-menuanchor="'+n+'"]').addClass(p))}function Mn(e,n){En(e),Ln(e,n)}function On(n){var t=e(b).index(y),o=n.index(y);return t==o?"none":t>o?"up":"down"}function An(e,n){return e==n?"none":e>n?"left":"right"}function Rn(e){if(!e.hasClass("fp-noscroll")){e.css("overflow","hidden");var n,t=l.scrollOverflowHandler,o=t.wrapContent(),i=e.closest(y),a=t.scrollable(e);a.length?n=t.scrollHeight(e):(n=e.get(0).scrollHeight,l.verticalCentered&&(n=e.find(k).get(0).scrollHeight));var r=yt-parseInt(i.css("padding-bottom"))-parseInt(i.css("padding-top"));n>r?a.length?t.update(e,r):(l.verticalCentered?e.find(k).wrapInner(o):e.wrapInner(o),t.create(e,r)):t.remove(e),e.css("overflow","")}}function Hn(e){e.hasClass(W)||e.addClass(W).wrapInner('<div class="'+T+'" style="height:'+Bn(e)+'px;" />')}function Bn(e){var n=yt;if(l.paddingTop||l.paddingBottom){var t=e;t.hasClass(S)||(t=e.closest(y));var o=parseInt(t.css("padding-top"))+parseInt(t.css("padding-bottom"));n=yt-o}return n}function zn(e,n){n?kn(St):In(St),St.css(tt(e)),setTimeout(function(){St.removeClass(d)},10)}function Dn(n){if(!n)return[];var t=St.find(y+'[data-anchor="'+n+'"]');return t.length||(t=e(y).eq(n-1)),t}function Pn(e,n){var t=n.find(q),o=t.find(z+'[data-anchor="'+e+'"]');return o.length||(o=t.find(z).eq(e)),o}function qn(e,n){var t=Dn(e);t.length&&("undefined"==typeof n&&(n=0),e===ut||t.hasClass(p)?Fn(t,n):Ke(t,function(){Fn(t,n)}))}function Fn(e,n){if("undefined"!=typeof n){var t=e.find(q),o=Pn(n,e);o.length&&Sn(t,o)}}function Vn(e,n){e.append('<div class="'+U+'"><ul></ul></div>');var t=e.find(Y);t.addClass(l.slidesNavPosition);for(var o=0;n>o;o++)t.find("ul").append('<li><a href="#"><span></span></a></li>');t.css("margin-left","-"+t.width()/2+"px"),t.find("li").first().find("a").addClass(p)}function Wn(e,n,t,o){var i="";l.anchors.length&&!l.lockAnchors&&(e?("undefined"!=typeof t&&(i=t),"undefined"==typeof n&&(n=e),ht=n,Un(i+"/"+n)):"undefined"!=typeof e?(ht=n,Un(t)):Un(t)),jn()}function Un(e){if(l.recordHistory)location.hash=e;else if(mt||wt)n.history.replaceState(i,i,"#"+e);else{var t=n.location.href.split("#")[0];n.location.replace(t+"#"+e)}}function Yn(e){var n=e.data("anchor"),t=e.index();return"undefined"==typeof n&&(n=t),n}function jn(){var n=e(b),t=n.find(D),o=Yn(n),i=Yn(t),a=String(o);t.length&&(a=a+"-"+i),a=a.replace("/","-").replace("#","");var r=new RegExp("\\b\\s?"+h+"-[^\\s]+\\b","g");dt[0].className=dt[0].className.replace(r,""),dt.addClass(h+"-"+a)}function Nn(){var e,o=t.createElement("p"),a={webkitTransform:"-webkit-transform",OTransform:"-o-transform",msTransform:"-ms-transform",MozTransform:"-moz-transform",transform:"transform"};t.body.insertBefore(o,null);for(var r in a)o.style[r]!==i&&(o.style[r]="translate3d(1px,1px,1px)",e=n.getComputedStyle(o).getPropertyValue(a[r]));return t.body.removeChild(o),e!==i&&e.length>0&&"none"!==e}function Xn(){t.addEventListener?(t.removeEventListener("mousewheel",Ye,!1),t.removeEventListener("wheel",Ye,!1),t.removeEventListener("MozMousePixelScroll",Ye,!1)):t.detachEvent("onmousewheel",Ye)}function Kn(){var e,o="";n.addEventListener?e="addEventListener":(e="attachEvent",o="on");var a="onwheel"in t.createElement("div")?"wheel":t.onmousewheel!==i?"mousewheel":"DOMMouseScroll";"DOMMouseScroll"==a?t[e](o+"MozMousePixelScroll",Ye,!1):t[e](o+a,Ye,!1)}function Qn(){St.on("mousedown",fn).on("mouseup",un)}function Gn(){St.off("mousedown",fn).off("mouseup",un)}function Jn(){(mt||wt)&&(l.autoScrolling&&dt.off(Ht.touchmove).on(Ht.touchmove,Pe),e(r).off(Ht.touchstart).on(Ht.touchstart,We).off(Ht.touchmove).on(Ht.touchmove,qe))}function Zn(){(mt||wt)&&e(r).off(Ht.touchstart).off(Ht.touchmove)}function $n(){var e;return e=n.PointerEvent?{down:"pointerdown",move:"pointermove"}:{down:"MSPointerDown",move:"MSPointerMove"}}function _n(e){var n=[];return n.y="undefined"!=typeof e.pageY&&(e.pageY||e.pageX)?e.pageY:e.touches[0].pageY,n.x="undefined"!=typeof e.pageX&&(e.pageY||e.pageX)?e.pageX:e.touches[0].pageX,wt&&Ve(e)&&l.scrollBar&&(n.y=e.touches[0].pageY,n.x=e.touches[0].pageX),n}function et(e,n){Q(0,"internal"),"undefined"!=typeof n&&(bt=!0),Sn(e.closest(q),e),"undefined"!=typeof n&&(bt=!1),Q(Bt.scrollingSpeed,"internal")}function nt(e){var n=o.round(e);if(l.css3&&l.autoScrolling&&!l.scrollBar){var t="translate3d(0px, -"+n+"px, 0px)";zn(t,!1)}else l.autoScrolling&&!l.scrollBar?St.css("top",-n):ct.scrollTop(n)}function tt(e){return{"-webkit-transform":e,"-moz-transform":e,"-ms-transform":e,transform:e}}function ot(e,n,t){switch(n){case"up":kt[t].up=e;break;case"down":kt[t].down=e;break;case"left":kt[t].left=e;break;case"right":kt[t].right=e;break;case"all":"m"==t?re(e):le(e)}}function it(n){s(!1,"internal"),re(!1),le(!1),St.addClass(f),clearTimeout(Et),clearTimeout(Lt),clearTimeout(It),clearTimeout(Mt),clearTimeout(Ot),ne.off("scroll",Re).off("hashchange",ln).off("resize",Cn),te.off("click touchstart",M+" a").off("mouseenter",M+" li").off("mouseleave",M+" li").off("click touchstart",j).off("mouseover",l.normalScrollElements).off("mouseout",l.normalScrollElements),e(y).off("click touchstart",X),clearTimeout(Et),clearTimeout(Lt),n&&at()}function at(){nt(0),St.find("img[data-src], source[data-src], audio[data-src], iframe[data-src]").each(function(){_e(e(this),"src")}),St.find("img[data-srcset]").each(function(){_e(e(this),"srcset")}),e(M+", "+Y+", "+X).remove(),e(y).css({height:"","background-color":"",padding:""}),e(z).css({width:""}),St.css({height:"",position:"","-ms-touch-action":"","touch-action":""}),ct.css({overflow:"",height:""}),e("html").removeClass(u),dt.removeClass(c),e.each(dt.get(0).className.split(/\s+/),function(e,n){0===n.indexOf(h)&&dt.removeClass(n)}),e(y+", "+z).each(function(){l.scrollOverflowHandler.remove(e(this)),e(this).removeClass(W+" "+p)}),In(St),St.find(k+", "+V+", "+q).each(function(){e(this).replaceWith(this.childNodes)}),St.css({"-webkit-transition":"none",transition:"none"}),ct.scrollTop(0);var n=[S,B,F];e.each(n,function(n,t){e("."+t).removeClass(t)})}function rt(e,n,t){l[e]=n,"internal"!==t&&(Bt[e]=n)}function lt(){var n=["fadingEffect","continuousHorizontal","scrollHorizontally","interlockedSlides","resetSliders","responsiveSlides","offsetSections","dragAndMove","scrollOverflowReset","parallax"];return e("html").hasClass(u)?void st("error","Fullpage.js can only be initialized once and you are doing it multiple times!"):(l.continuousVertical&&(l.loopTop||l.loopBottom)&&(l.continuousVertical=!1,st("warn","Option `loopTop/loopBottom` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled")),l.scrollBar&&l.scrollOverflow&&st("warn","Option `scrollBar` is mutually exclusive with `scrollOverflow`. Sections with scrollOverflow might not work well in Firefox"),!l.continuousVertical||!l.scrollBar&&l.autoScrolling||(l.continuousVertical=!1,st("warn","Scroll bars (`scrollBar:true` or `autoScrolling:false`) are mutually exclusive with `continuousVertical`; `continuousVertical` disabled")),e.each(n,function(e,n){l[n]&&st("warn","fullpage.js extensions require jquery.fullpage.extensions.min.js file instead of the usual jquery.fullpage.js. Requested: "+n)}),void e.each(l.anchors,function(n,t){var o=te.find("[name]").filter(function(){return e(this).attr("name")&&e(this).attr("name").toLowerCase()==t.toLowerCase()}),i=te.find("[id]").filter(function(){return e(this).attr("id")&&e(this).attr("id").toLowerCase()==t.toLowerCase()});(i.length||o.length)&&(st("error","data-anchor tags can not have the same value as any `id` element on the site (or `name` element for IE)."),i.length&&st("error",'"'+t+'" is is being used by another element `id` property'),o.length&&st("error",'"'+t+'" is is being used by another element `name` property'))}))}function st(e,n){console&&console[e]&&console[e]("fullPage: "+n)}if(e("html").hasClass(u))return void lt();var ct=e("html, body"),dt=e("body"),ft=e.fn.fullpage;l=e.extend({menu:!1,anchors:[],lockAnchors:!1,navigation:!1,navigationPosition:"right",navigationTooltips:[],showActiveTooltip:!1,slidesNavigation:!1,slidesNavPosition:"bottom",scrollBar:!1,hybrid:!1,css3:!0,scrollingSpeed:700,autoScrolling:!0,fitToSection:!0,fitToSectionDelay:1e3,easing:"easeInOutCubic",easingcss3:"ease",loopBottom:!1,loopTop:!1,loopHorizontal:!0,continuousVertical:!1,continuousHorizontal:!1,scrollHorizontally:!1,interlockedSlides:!1,dragAndMove:!1,offsetSections:!1,resetSliders:!1,fadingEffect:!1,normalScrollElements:null,scrollOverflow:!1,scrollOverflowReset:!1,scrollOverflowHandler:ie,scrollOverflowOptions:null,touchSensitivity:5,normalScrollElementTouchThreshold:5,bigSectionsDestination:null,keyboardScrolling:!0,animateAnchor:!0,recordHistory:!0,controlArrows:!0,controlArrowColor:"#fff",verticalCentered:!0,sectionsColor:[],paddingTop:0,paddingBottom:0,fixedElements:null,responsive:0,responsiveWidth:0,responsiveHeight:0,responsiveSlides:!1,parallax:!1,parallaxOptions:{type:"reveal",percentage:62,property:"translate"},sectionSelector:w,slideSelector:H,afterLoad:null,onLeave:null,afterRender:null,afterResize:null,afterReBuild:null,afterSlideLoad:null,onSlideLeave:null,afterResponsive:null,lazyLoading:!0},l);var ut,ht,pt,vt,gt=!1,mt=navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/),wt="ontouchstart"in n||navigator.msMaxTouchPoints>0||navigator.maxTouchPoints,St=e(this),yt=ne.height(),bt=!1,xt=!0,Ct=!0,Tt=[],kt={};kt.m={up:!0,down:!0,left:!0,right:!0},kt.k=e.extend(!0,{},kt.m);var It,Lt,Et,Mt,Ot,At,Rt=$n(),Ht={touchmove:"ontouchmove"in n?"touchmove":Rt.move,touchstart:"ontouchstart"in n?"touchstart":Rt.down},Bt=e.extend(!0,{},l);lt(),oe.click=wt,oe=e.extend(oe,l.scrollOverflowOptions),e.extend(e.easing,{easeInOutCubic:function(e,n,t,o,i){return(n/=i/2)<1?o/2*n*n*n+t:o/2*((n-=2)*n*n+2)+t}}),e(this).length&&(ft.setAutoScrolling=s,ft.setRecordHistory=N,ft.setScrollingSpeed=Q,ft.setFitToSection=Z,ft.setLockAnchors=$,ft.setMouseWheelScrolling=ae,ft.setAllowScrolling=re,ft.setKeyboardScrolling=le,ft.moveSectionUp=se,ft.moveSectionDown=ce,ft.silentMoveTo=de,ft.moveTo=fe,ft.moveSlideRight=ue,ft.moveSlideLeft=he,ft.fitToSection=He,ft.reBuild=pe,ft.setResponsive=ve,ft.destroy=it,ge(),me());var zt=!1,Dt=0,Pt=0,qt=0,Ft=0,Vt=0,Wt=(new Date).getTime(),Ut=0,Yt=0,jt=yt},"undefined"!=typeof IScroll&&(IScroll.prototype.wheelOn=function(){this.wrapper.addEventListener("wheel",this),this.wrapper.addEventListener("mousewheel",this),this.wrapper.addEventListener("DOMMouseScroll",this)},IScroll.prototype.wheelOff=function(){this.wrapper.removeEventListener("wheel",this),this.wrapper.removeEventListener("mousewheel",this),this.wrapper.removeEventListener("DOMMouseScroll",this)});var ie={refreshId:null,iScrollInstances:[],toggleWheel:function(n){var t=e(b).find(s);t.each(function(){var t=e(this).data("iscrollInstance");"undefined"!=typeof t&&t&&(n?t.wheelOn():t.wheelOff())})},onLeave:function(){ie.toggleWheel(!1)},beforeLeave:function(){ie.onLeave()},afterLoad:function(){ie.toggleWheel(!0)},create:function(n,t){var o=n.find(s);o.height(t),o.each(function(){var n=e(this),t=n.data("iscrollInstance");t&&e.each(ie.iScrollInstances,function(){e(this).destroy()}),t=new IScroll(n.get(0),oe),ie.iScrollInstances.push(t),t.wheelOff(),n.data("iscrollInstance",t)})},isScrolled:function(e,n){var t=n.data("iscrollInstance");return t?"top"===e?t.y>=0&&!n.scrollTop():"bottom"===e?0-t.y+n.scrollTop()+1+n.innerHeight()>=n[0].scrollHeight:void 0:!0},scrollable:function(e){return e.find(q).length?e.find(D).find(s):e.find(s)},scrollHeight:function(e){return e.find(s).children().first().get(0).scrollHeight},remove:function(e){var n=e.find(s);if(n.length){var t=n.data("iscrollInstance");t.destroy(),n.data("iscrollInstance",null)}e.find(s).children().first().children().first().unwrap().unwrap()},update:function(n,t){clearTimeout(ie.refreshId),ie.refreshId=setTimeout(function(){e.each(ie.iScrollInstances,function(){e(this).get(0).refresh()})},150),n.find(s).css("height",t+"px").parent().css("height",t+"px")},wrapContent:function(){return'<div class="'+l+'"><div class="fp-scroller"></div></div>'}}});
//# sourceMappingURL=jquery.fullpage.min.js.map

/*!
 * imagesLoaded PACKAGED v4.1.1
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

!function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||{};return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=0,o=i[n];e=e||[];for(var r=this._onceEvents&&this._onceEvents[t];o;){var s=r&&r[o];s&&(this.off(t,o),delete r[o]),o.apply(this,e),n+=s?0:1,o=i[n]}return this}},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define(["ev-emitter/ev-emitter"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.imagesLoaded=e(t,t.EvEmitter)}(window,function(t,e){function i(t,e){for(var i in e)t[i]=e[i];return t}function n(t){var e=[];if(Array.isArray(t))e=t;else if("number"==typeof t.length)for(var i=0;i<t.length;i++)e.push(t[i]);else e.push(t);return e}function o(t,e,r){return this instanceof o?("string"==typeof t&&(t=document.querySelectorAll(t)),this.elements=n(t),this.options=i({},this.options),"function"==typeof e?r=e:i(this.options,e),r&&this.on("always",r),this.getImages(),h&&(this.jqDeferred=new h.Deferred),void setTimeout(function(){this.check()}.bind(this))):new o(t,e,r)}function r(t){this.img=t}function s(t,e){this.url=t,this.element=e,this.img=new Image}var h=t.jQuery,a=t.console;o.prototype=Object.create(e.prototype),o.prototype.options={},o.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},o.prototype.addElementImages=function(t){"IMG"==t.nodeName&&this.addImage(t),this.options.background===!0&&this.addElementBackgroundImages(t);var e=t.nodeType;if(e&&d[e]){for(var i=t.querySelectorAll("img"),n=0;n<i.length;n++){var o=i[n];this.addImage(o)}if("string"==typeof this.options.background){var r=t.querySelectorAll(this.options.background);for(n=0;n<r.length;n++){var s=r[n];this.addElementBackgroundImages(s)}}}};var d={1:!0,9:!0,11:!0};return o.prototype.addElementBackgroundImages=function(t){var e=getComputedStyle(t);if(e)for(var i=/url\((['"])?(.*?)\1\)/gi,n=i.exec(e.backgroundImage);null!==n;){var o=n&&n[2];o&&this.addBackground(o,t),n=i.exec(e.backgroundImage)}},o.prototype.addImage=function(t){var e=new r(t);this.images.push(e)},o.prototype.addBackground=function(t,e){var i=new s(t,e);this.images.push(i)},o.prototype.check=function(){function t(t,i,n){setTimeout(function(){e.progress(t,i,n)})}var e=this;return this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?void this.images.forEach(function(e){e.once("progress",t),e.check()}):void this.complete()},o.prototype.progress=function(t,e,i){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!t.isLoaded,this.emitEvent("progress",[this,t,e]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,t),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&a&&a.log("progress: "+i,t,e)},o.prototype.complete=function(){var t=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(t,[this]),this.emitEvent("always",[this]),this.jqDeferred){var e=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[e](this)}},r.prototype=Object.create(e.prototype),r.prototype.check=function(){var t=this.getIsImageComplete();return t?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),void(this.proxyImage.src=this.img.src))},r.prototype.getIsImageComplete=function(){return this.img.complete&&void 0!==this.img.naturalWidth},r.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.img,e])},r.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},r.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},r.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},r.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype=Object.create(r.prototype),s.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url;var t=this.getIsImageComplete();t&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},s.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.element,e])},o.makeJQueryPlugin=function(e){e=e||t.jQuery,e&&(h=e,h.fn.imagesLoaded=function(t,e){var i=new o(this,t,e);return i.jqDeferred.promise(h(this))})},o.makeJQueryPlugin(),o});
/*
 2017 Julian Garnier
 Released under the MIT license
*/
var $jscomp$this=this;
(function(u,r){"function"===typeof define&&define.amd?define([],r):"object"===typeof module&&module.exports?module.exports=r():u.anime=r()})(this,function(){function u(a){if(!g.col(a))try{return document.querySelectorAll(a)}catch(b){}}function r(a){return a.reduce(function(a,c){return a.concat(g.arr(c)?r(c):c)},[])}function v(a){if(g.arr(a))return a;g.str(a)&&(a=u(a)||a);return a instanceof NodeList||a instanceof HTMLCollection?[].slice.call(a):[a]}function E(a,b){return a.some(function(a){return a===b})}
function z(a){var b={},c;for(c in a)b[c]=a[c];return b}function F(a,b){var c=z(a),d;for(d in a)c[d]=b.hasOwnProperty(d)?b[d]:a[d];return c}function A(a,b){var c=z(a),d;for(d in b)c[d]=g.und(a[d])?b[d]:a[d];return c}function R(a){a=a.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,function(a,b,c,h){return b+b+c+c+h+h});var b=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);a=parseInt(b[1],16);var c=parseInt(b[2],16),b=parseInt(b[3],16);return"rgb("+a+","+c+","+b+")"}function S(a){function b(a,b,c){0>
c&&(c+=1);1<c&&--c;return c<1/6?a+6*(b-a)*c:.5>c?b:c<2/3?a+(b-a)*(2/3-c)*6:a}var c=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(a);a=parseInt(c[1])/360;var d=parseInt(c[2])/100,c=parseInt(c[3])/100;if(0==d)d=c=a=c;else{var e=.5>c?c*(1+d):c+d-c*d,k=2*c-e,d=b(k,e,a+1/3),c=b(k,e,a);a=b(k,e,a-1/3)}return"rgb("+255*d+","+255*c+","+255*a+")"}function w(a){if(a=/([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|pc|vw|vh|deg|rad|turn)?/.exec(a))return a[2]}function T(a){if(-1<a.indexOf("translate"))return"px";
if(-1<a.indexOf("rotate")||-1<a.indexOf("skew"))return"deg"}function G(a,b){return g.fnc(a)?a(b.target,b.id,b.total):a}function B(a,b){if(b in a.style)return getComputedStyle(a).getPropertyValue(b.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase())||"0"}function H(a,b){if(g.dom(a)&&E(U,b))return"transform";if(g.dom(a)&&(a.getAttribute(b)||g.svg(a)&&a[b]))return"attribute";if(g.dom(a)&&"transform"!==b&&B(a,b))return"css";if(null!=a[b])return"object"}function V(a,b){var c=T(b),c=-1<b.indexOf("scale")?
1:0+c;a=a.style.transform;if(!a)return c;for(var d=[],e=[],k=[],h=/(\w+)\((.+?)\)/g;d=h.exec(a);)e.push(d[1]),k.push(d[2]);a=k.filter(function(a,c){return e[c]===b});return a.length?a[0]:c}function I(a,b){switch(H(a,b)){case "transform":return V(a,b);case "css":return B(a,b);case "attribute":return a.getAttribute(b)}return a[b]||0}function J(a,b){var c=/^(\*=|\+=|-=)/.exec(a);if(!c)return a;b=parseFloat(b);a=parseFloat(a.replace(c[0],""));switch(c[0][0]){case "+":return b+a;case "-":return b-a;case "*":return b*
a}}function C(a){return g.obj(a)&&a.hasOwnProperty("totalLength")}function W(a,b){function c(c){c=void 0===c?0:c;return a.el.getPointAtLength(1<=b+c?b+c:0)}var d=c(),e=c(-1),k=c(1);switch(a.property){case "x":return d.x;case "y":return d.y;case "angle":return 180*Math.atan2(k.y-e.y,k.x-e.x)/Math.PI}}function K(a,b){var c=/-?\d*\.?\d+/g;a=C(a)?a.totalLength:a;if(g.col(a))b=g.rgb(a)?a:g.hex(a)?R(a):g.hsl(a)?S(a):void 0;else{var d=w(a);a=d?a.substr(0,a.length-d.length):a;b=b?a+b:a}b+="";return{original:b,
numbers:b.match(c)?b.match(c).map(Number):[0],strings:b.split(c)}}function X(a,b){return b.reduce(function(b,d,e){return b+a[e-1]+d})}function L(a){return(a?r(g.arr(a)?a.map(v):v(a)):[]).filter(function(a,c,d){return d.indexOf(a)===c})}function Y(a){var b=L(a);return b.map(function(a,d){return{target:a,id:d,total:b.length}})}function Z(a,b){var c=z(b);if(g.arr(a)){var d=a.length;2!==d||g.obj(a[0])?g.fnc(b.duration)||(c.duration=b.duration/d):a={value:a}}return v(a).map(function(a,c){c=c?0:b.delay;
a=g.obj(a)&&!C(a)?a:{value:a};g.und(a.delay)&&(a.delay=c);return a}).map(function(a){return A(a,c)})}function aa(a,b){var c={},d;for(d in a){var e=G(a[d],b);g.arr(e)&&(e=e.map(function(a){return G(a,b)}),1===e.length&&(e=e[0]));c[d]=e}c.duration=parseFloat(c.duration);c.delay=parseFloat(c.delay);return c}function ba(a){return g.arr(a)?x.apply(this,a):M[a]}function ca(a,b){var c;return a.tweens.map(function(d){d=aa(d,b);var e=d.value,k=I(b.target,a.name),h=c?c.to.original:k,h=g.arr(e)?e[0]:h,n=J(g.arr(e)?
e[1]:e,h),k=w(n)||w(h)||w(k);d.isPath=C(e);d.from=K(h,k);d.to=K(n,k);d.start=c?c.end:a.offset;d.end=d.start+d.delay+d.duration;d.easing=ba(d.easing);d.elasticity=(1E3-Math.min(Math.max(d.elasticity,1),999))/1E3;g.col(d.from.original)&&(d.round=1);return c=d})}function da(a,b){return r(a.map(function(a){return b.map(function(b){var c=H(a.target,b.name);if(c){var d=ca(b,a);b={type:c,property:b.name,animatable:a,tweens:d,duration:d[d.length-1].end,delay:d[0].delay}}else b=void 0;return b})})).filter(function(a){return!g.und(a)})}
function N(a,b,c){var d="delay"===a?Math.min:Math.max;return b.length?d.apply(Math,b.map(function(b){return b[a]})):c[a]}function ea(a){var b=F(fa,a),c=F(ga,a),d=Y(a.targets),e=[],g=A(b,c),h;for(h in a)g.hasOwnProperty(h)||"targets"===h||e.push({name:h,offset:g.offset,tweens:Z(a[h],c)});a=da(d,e);return A(b,{animatables:d,animations:a,duration:N("duration",a,c),delay:N("delay",a,c)})}function m(a){function b(){return window.Promise&&new Promise(function(a){return P=a})}function c(a){return f.reversed?
f.duration-a:a}function d(a){for(var b=0,c={},d=f.animations,e={};b<d.length;){var g=d[b],h=g.animatable,n=g.tweens;e.tween=n.filter(function(b){return a<b.end})[0]||n[n.length-1];e.isPath$0=e.tween.isPath;e.round=e.tween.round;e.eased=e.tween.easing(Math.min(Math.max(a-e.tween.start-e.tween.delay,0),e.tween.duration)/e.tween.duration,e.tween.elasticity);n=X(e.tween.to.numbers.map(function(a){return function(b,c){c=a.isPath$0?0:a.tween.from.numbers[c];b=c+a.eased*(b-c);a.isPath$0&&(b=W(a.tween.value,
b));a.round&&(b=Math.round(b*a.round)/a.round);return b}}(e)),e.tween.to.strings);ha[g.type](h.target,g.property,n,c,h.id);g.currentValue=n;b++;e={isPath$0:e.isPath$0,tween:e.tween,eased:e.eased,round:e.round}}if(c)for(var k in c)D||(D=B(document.body,"transform")?"transform":"-webkit-transform"),f.animatables[k].target.style[D]=c[k].join(" ");f.currentTime=a;f.progress=a/f.duration*100}function e(a){if(f[a])f[a](f)}function g(){f.remaining&&!0!==f.remaining&&f.remaining--}function h(a){var h=f.duration,
k=f.offset,m=f.delay,O=f.currentTime,p=f.reversed,q=c(a),q=Math.min(Math.max(q,0),h);q>k&&q<h?(d(q),!f.began&&q>=m&&(f.began=!0,e("begin")),e("run")):(q<=k&&0!==O&&(d(0),p&&g()),q>=h&&O!==h&&(d(h),p||g()));a>=h&&(f.remaining?(t=n,"alternate"===f.direction&&(f.reversed=!f.reversed)):(f.pause(),P(),Q=b(),f.completed||(f.completed=!0,e("complete"))),l=0);if(f.children)for(a=f.children,h=0;h<a.length;h++)a[h].seek(q);e("update")}a=void 0===a?{}:a;var n,t,l=0,P=null,Q=b(),f=ea(a);f.reset=function(){var a=
f.direction,b=f.loop;f.currentTime=0;f.progress=0;f.paused=!0;f.began=!1;f.completed=!1;f.reversed="reverse"===a;f.remaining="alternate"===a&&1===b?2:b};f.tick=function(a){n=a;t||(t=n);h((l+n-t)*m.speed)};f.seek=function(a){h(c(a))};f.pause=function(){var a=p.indexOf(f);-1<a&&p.splice(a,1);f.paused=!0};f.play=function(){f.paused&&(f.paused=!1,t=0,l=f.completed?0:c(f.currentTime),p.push(f),y||ia())};f.reverse=function(){f.reversed=!f.reversed;t=0;l=c(f.currentTime)};f.restart=function(){f.pause();
f.reset();f.play()};f.finished=Q;f.reset();f.autoplay&&f.play();return f}var fa={update:void 0,begin:void 0,run:void 0,complete:void 0,loop:1,direction:"normal",autoplay:!0,offset:0},ga={duration:1E3,delay:0,easing:"easeOutElastic",elasticity:500,round:0},U="translateX translateY translateZ rotate rotateX rotateY rotateZ scale scaleX scaleY scaleZ skewX skewY".split(" "),D,g={arr:function(a){return Array.isArray(a)},obj:function(a){return-1<Object.prototype.toString.call(a).indexOf("Object")},svg:function(a){return a instanceof
SVGElement},dom:function(a){return a.nodeType||g.svg(a)},str:function(a){return"string"===typeof a},fnc:function(a){return"function"===typeof a},und:function(a){return"undefined"===typeof a},hex:function(a){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a)},rgb:function(a){return/^rgb/.test(a)},hsl:function(a){return/^hsl/.test(a)},col:function(a){return g.hex(a)||g.rgb(a)||g.hsl(a)}},x=function(){function a(a,c,d){return(((1-3*d+3*c)*a+(3*d-6*c))*a+3*c)*a}return function(b,c,d,e){if(0<=b&&1>=b&&
0<=d&&1>=d){var g=new Float32Array(11);if(b!==c||d!==e)for(var h=0;11>h;++h)g[h]=a(.1*h,b,d);return function(h){if(b===c&&d===e)return h;if(0===h)return 0;if(1===h)return 1;for(var k=0,l=1;10!==l&&g[l]<=h;++l)k+=.1;--l;var l=k+(h-g[l])/(g[l+1]-g[l])*.1,n=3*(1-3*d+3*b)*l*l+2*(3*d-6*b)*l+3*b;if(.001<=n){for(k=0;4>k;++k){n=3*(1-3*d+3*b)*l*l+2*(3*d-6*b)*l+3*b;if(0===n)break;var m=a(l,b,d)-h,l=l-m/n}h=l}else if(0===n)h=l;else{var l=k,k=k+.1,f=0;do m=l+(k-l)/2,n=a(m,b,d)-h,0<n?k=m:l=m;while(1e-7<Math.abs(n)&&
10>++f);h=m}return a(h,c,e)}}}}(),M=function(){function a(a,b){return 0===a||1===a?a:-Math.pow(2,10*(a-1))*Math.sin(2*(a-1-b/(2*Math.PI)*Math.asin(1))*Math.PI/b)}var b="Quad Cubic Quart Quint Sine Expo Circ Back Elastic".split(" "),c={In:[[.55,.085,.68,.53],[.55,.055,.675,.19],[.895,.03,.685,.22],[.755,.05,.855,.06],[.47,0,.745,.715],[.95,.05,.795,.035],[.6,.04,.98,.335],[.6,-.28,.735,.045],a],Out:[[.25,.46,.45,.94],[.215,.61,.355,1],[.165,.84,.44,1],[.23,1,.32,1],[.39,.575,.565,1],[.19,1,.22,1],
[.075,.82,.165,1],[.175,.885,.32,1.275],function(b,c){return 1-a(1-b,c)}],InOut:[[.455,.03,.515,.955],[.645,.045,.355,1],[.77,0,.175,1],[.86,0,.07,1],[.445,.05,.55,.95],[1,0,0,1],[.785,.135,.15,.86],[.68,-.55,.265,1.55],function(b,c){return.5>b?a(2*b,c)/2:1-a(-2*b+2,c)/2}]},d={linear:x(.25,.25,.75,.75)},e={},k;for(k in c)e.type=k,c[e.type].forEach(function(a){return function(c,e){d["ease"+a.type+b[e]]=g.fnc(c)?c:x.apply($jscomp$this,c)}}(e)),e={type:e.type};return d}(),ha={css:function(a,b,c){return a.style[b]=
c},attribute:function(a,b,c){return a.setAttribute(b,c)},object:function(a,b,c){return a[b]=c},transform:function(a,b,c,d,e){d[e]||(d[e]=[]);d[e].push(b+"("+c+")")}},p=[],y=0,ia=function(){function a(){y=requestAnimationFrame(b)}function b(b){var c=p.length;if(c){for(var e=0;e<c;)p[e]&&p[e].tick(b),e++;a()}else cancelAnimationFrame(y),y=0}return a}();m.version="2.0.1";m.speed=1;m.running=p;m.remove=function(a){a=L(a);for(var b=p.length-1;0<=b;b--)for(var c=p[b],d=c.animations,e=d.length-1;0<=e;e--)E(a,
d[e].animatable.target)&&(d.splice(e,1),d.length||c.pause())};m.getValue=I;m.path=function(a,b){var c=g.str(a)?u(a)[0]:a,d=b||100;return function(a){return{el:c,property:a,totalLength:c.getTotalLength()*(d/100)}}};m.setDashoffset=function(a){var b=a.getTotalLength();a.setAttribute("stroke-dasharray",b);return b};m.bezier=x;m.easings=M;m.timeline=function(a){var b=m(a);b.duration=0;b.children=[];b.add=function(a){v(a).forEach(function(a){var c=a.offset,d=b.duration;a.autoplay=!1;a.offset=g.und(c)?
d:J(c,d);a=m(a);a.duration>d&&(b.duration=a.duration);b.children.push(a)});return b};return b};m.random=function(a,b){return Math.floor(Math.random()*(b-a+1))+a};return m});
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("scrollMonitor",[],e):"object"==typeof exports?exports.scrollMonitor=e():t.scrollMonitor=e()}(this,function(){return function(t){function e(o){if(i[o])return i[o].exports;var s=i[o]={exports:{},id:o,loaded:!1};return t[o].call(s.exports,s,s.exports,e),s.loaded=!0,s.exports}var i={};return e.m=t,e.c=i,e.p="",e(0)}([function(t,e,i){"use strict";var o=i(1),s=o.isInBrowser,n=i(2),r=new n(s?document.body:null);r.setStateFromDOM(null),r.listenToDOM(),s&&(window.scrollMonitor=r),t.exports=r},function(t,e){"use strict";e.VISIBILITYCHANGE="visibilityChange",e.ENTERVIEWPORT="enterViewport",e.FULLYENTERVIEWPORT="fullyEnterViewport",e.EXITVIEWPORT="exitViewport",e.PARTIALLYEXITVIEWPORT="partiallyExitViewport",e.LOCATIONCHANGE="locationChange",e.STATECHANGE="stateChange",e.eventTypes=[e.VISIBILITYCHANGE,e.ENTERVIEWPORT,e.FULLYENTERVIEWPORT,e.EXITVIEWPORT,e.PARTIALLYEXITVIEWPORT,e.LOCATIONCHANGE,e.STATECHANGE],e.isOnServer="undefined"==typeof window,e.isInBrowser=!e.isOnServer,e.defaultOffsets={top:0,bottom:0}},function(t,e,i){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t){return c?0:t===document.body?window.innerHeight||document.documentElement.clientHeight:t.clientHeight}function n(t){return c?0:t===document.body?Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight,document.documentElement.clientHeight):t.scrollHeight}function r(t){return c?0:t===document.body?window.pageYOffset||document.documentElement&&document.documentElement.scrollTop||document.body.scrollTop:t.scrollTop}var h=i(1),c=h.isOnServer,a=h.isInBrowser,l=h.eventTypes,p=i(3),w=function(){function t(e,i){function h(){if(a.viewportTop=r(e),a.viewportBottom=a.viewportTop+a.viewportHeight,a.documentHeight=n(e),a.documentHeight!==p){for(w=a.watchers.length;w--;)a.watchers[w].recalculateLocation();p=a.documentHeight}}function c(){for(u=a.watchers.length;u--;)a.watchers[u].update();for(u=a.watchers.length;u--;)a.watchers[u].triggerCallbacks()}o(this,t);var a=this;this.item=e,this.watchers=[],this.viewportTop=null,this.viewportBottom=null,this.documentHeight=n(e),this.viewportHeight=s(e),this.DOMListener=function(){t.prototype.DOMListener.apply(a,arguments)},this.eventTypes=l,i&&(this.containerWatcher=i.create(e));var p,w,u;this.update=function(){h(),c()},this.recalculateLocations=function(){this.documentHeight=0,this.update()}}return t.prototype.listenToDOM=function(){a&&(window.addEventListener?(this.item===document.body?window.addEventListener("scroll",this.DOMListener):this.item.addEventListener("scroll",this.DOMListener),window.addEventListener("resize",this.DOMListener)):(this.item===document.body?window.attachEvent("onscroll",this.DOMListener):this.item.attachEvent("onscroll",this.DOMListener),window.attachEvent("onresize",this.DOMListener)),this.destroy=function(){window.addEventListener?(this.item===document.body?(window.removeEventListener("scroll",this.DOMListener),this.containerWatcher.destroy()):this.item.removeEventListener("scroll",this.DOMListener),window.removeEventListener("resize",this.DOMListener)):(this.item===document.body?(window.detachEvent("onscroll",this.DOMListener),this.containerWatcher.destroy()):this.item.detachEvent("onscroll",this.DOMListener),window.detachEvent("onresize",this.DOMListener))})},t.prototype.destroy=function(){},t.prototype.DOMListener=function(t){this.setStateFromDOM(t)},t.prototype.setStateFromDOM=function(t){var e=r(this.item),i=s(this.item),o=n(this.item);this.setState(e,i,o,t)},t.prototype.setState=function(t,e,i,o){var s=e!==this.viewportHeight||i!==this.contentHeight;if(this.latestEvent=o,this.viewportTop=t,this.viewportHeight=e,this.viewportBottom=t+e,this.contentHeight=i,s)for(var n=this.watchers.length;n--;)this.watchers[n].recalculateLocation();this.updateAndTriggerWatchers(o)},t.prototype.updateAndTriggerWatchers=function(t){for(var e=this.watchers.length;e--;)this.watchers[e].update();for(e=this.watchers.length;e--;)this.watchers[e].triggerCallbacks(t)},t.prototype.createCustomContainer=function(){return new t},t.prototype.createContainer=function(e){"string"==typeof e?e=document.querySelector(e):e&&e.length>0&&(e=e[0]);var i=new t(e,this);return i.setStateFromDOM(),i.listenToDOM(),i},t.prototype.create=function(t,e){"string"==typeof t?t=document.querySelector(t):t&&t.length>0&&(t=t[0]);var i=new p(this,t,e);return this.watchers.push(i),i},t.prototype.beget=function(t,e){return this.create(t,e)},t}();t.exports=w},function(t,e,i){"use strict";function o(t,e,i){function o(t,e){if(0!==t.length)for(E=t.length;E--;)T=t[E],T.callback.call(s,e,s),T.isOne&&t.splice(E,1)}var s=this;this.watchItem=e,this.container=t,i?i===+i?this.offsets={top:i,bottom:i}:this.offsets={top:i.top||u.top,bottom:i.bottom||u.bottom}:this.offsets=u,this.callbacks={};for(var d=0,f=w.length;d<f;d++)s.callbacks[w[d]]=[];this.locked=!1;var m,v,b,I,E,T;this.triggerCallbacks=function(t){switch(this.isInViewport&&!m&&o(this.callbacks[r],t),this.isFullyInViewport&&!v&&o(this.callbacks[h],t),this.isAboveViewport!==b&&this.isBelowViewport!==I&&(o(this.callbacks[n],t),v||this.isFullyInViewport||(o(this.callbacks[h],t),o(this.callbacks[a],t)),m||this.isInViewport||(o(this.callbacks[r],t),o(this.callbacks[c],t))),!this.isFullyInViewport&&v&&o(this.callbacks[a],t),!this.isInViewport&&m&&o(this.callbacks[c],t),this.isInViewport!==m&&o(this.callbacks[n],t),!0){case m!==this.isInViewport:case v!==this.isFullyInViewport:case b!==this.isAboveViewport:case I!==this.isBelowViewport:o(this.callbacks[p],t)}m=this.isInViewport,v=this.isFullyInViewport,b=this.isAboveViewport,I=this.isBelowViewport},this.recalculateLocation=function(){if(!this.locked){var t=this.top,e=this.bottom;if(this.watchItem.nodeName){var i=this.watchItem.style.display;"none"===i&&(this.watchItem.style.display="");for(var s=0,n=this.container;n.containerWatcher;)s+=n.containerWatcher.top-n.containerWatcher.container.viewportTop,n=n.containerWatcher.container;var r=this.watchItem.getBoundingClientRect();this.top=r.top+this.container.viewportTop-s,this.bottom=r.bottom+this.container.viewportTop-s,"none"===i&&(this.watchItem.style.display=i)}else this.watchItem===+this.watchItem?this.watchItem>0?this.top=this.bottom=this.watchItem:this.top=this.bottom=this.container.documentHeight-this.watchItem:(this.top=this.watchItem.top,this.bottom=this.watchItem.bottom);this.top-=this.offsets.top,this.bottom+=this.offsets.bottom,this.height=this.bottom-this.top,void 0===t&&void 0===e||this.top===t&&this.bottom===e||o(this.callbacks[l],null)}},this.recalculateLocation(),this.update(),m=this.isInViewport,v=this.isFullyInViewport,b=this.isAboveViewport,I=this.isBelowViewport}var s=i(1),n=s.VISIBILITYCHANGE,r=s.ENTERVIEWPORT,h=s.FULLYENTERVIEWPORT,c=s.EXITVIEWPORT,a=s.PARTIALLYEXITVIEWPORT,l=s.LOCATIONCHANGE,p=s.STATECHANGE,w=s.eventTypes,u=s.defaultOffsets;o.prototype={on:function(t,e,i){switch(!0){case t===n&&!this.isInViewport&&this.isAboveViewport:case t===r&&this.isInViewport:case t===h&&this.isFullyInViewport:case t===c&&this.isAboveViewport&&!this.isInViewport:case t===a&&this.isInViewport&&this.isAboveViewport:if(e.call(this,this.container.latestEvent,this),i)return}if(!this.callbacks[t])throw new Error("Tried to add a scroll monitor listener of type "+t+". Your options are: "+w.join(", "));this.callbacks[t].push({callback:e,isOne:i||!1})},off:function(t,e){if(!this.callbacks[t])throw new Error("Tried to remove a scroll monitor listener of type "+t+". Your options are: "+w.join(", "));for(var i,o=0;i=this.callbacks[t][o];o++)if(i.callback===e){this.callbacks[t].splice(o,1);break}},one:function(t,e){this.on(t,e,!0)},recalculateSize:function(){this.height=this.watchItem.offsetHeight+this.offsets.top+this.offsets.bottom,this.bottom=this.top+this.height},update:function(){this.isAboveViewport=this.top<this.container.viewportTop,this.isBelowViewport=this.bottom>this.container.viewportBottom,this.isInViewport=this.top<this.container.viewportBottom&&this.bottom>this.container.viewportTop,this.isFullyInViewport=this.top>=this.container.viewportTop&&this.bottom<=this.container.viewportBottom||this.isAboveViewport&&this.isBelowViewport},destroy:function(){var t=this.container.watchers.indexOf(this),e=this;this.container.watchers.splice(t,1);for(var i=0,o=w.length;i<o;i++)e.callbacks[w[i]].length=0},lock:function(){this.locked=!0},unlock:function(){this.locked=!1}};for(var d=function(t){return function(e,i){this.on.call(this,t,e,i)}},f=0,m=w.length;f<m;f++){var v=w[f];o.prototype[v]=d(v)}t.exports=o}])});
//# sourceMappingURL=scrollMonitor.js.map

// = lib/bootstrap.min.js
// = ../../bower_components/jquery-background-video/jquery.background-video.js
// = lib/bootstrap.min.js
// = lib/jquery.fancybox.min.js
// = ../../bower_components/jquery-ui/ui/widget.js
// = ../../bower_components/jquery-ui/ui/keycode.js
// = ../../bower_components/jquery-ui/ui/effect.js
// = ../../bower_components/jquery-ui/ui/widgets/mouse.js
// = ../../bower_components/jquery-ui/ui/widgets/slider.js
// = ../../bower_components/jquery-ui/ui/effects/effect-slide.js