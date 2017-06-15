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

  //= init/jquery-ui-init.js

  //= init/nav-left.js

  $('#fullpage').fullpage({
    hybrid: true,
    fitToSection: false
  });
});

//= init/transformicons.js

//= init/animated-gradient.js


jQuery(document).ready(function ($) {
  'use strict';

  // MASTER SLIDER START
  var slider = new MasterSlider();
  slider.setup('projects-masterslider', {
    width: '100%', // slider standard width
    height: '100%', // slider standard height
    space: 0,
    mouse: false,
    grabCursor: false,
    view: "basic",
    layout: "autofill",//*"boxed"*/
    parallaxMode: "mouse",
    speed: 15,
    centerControls: false,
    loop: true,
    instantStartLayers: true,
    autoplay: false

    //а это все свойства, что поддерживает данный слайдер паралакс
    /*
     forceInit: !0,
     mouse: !0,
     swipe: !0,
     grabCursor: !0,
     fillMode: "fill",
     start: 1,
     inView: 15,
     critMargin: 1,
     heightLimit: !0,
     smoothHeight: !0,
     autoHeight: !1,
     minHeight: -1,
     fullwidth: !1,
     fullheight: !1,
     autofill: !1,
     layersMode: "center",
     hideLayers: !1,
     endPause: !1,
     overPause: !0,
     shuffle: !1,
     dir: "h",
     preload: 0,
     wheel: !1,
     autofillTarget: null,
     fullscreenMargin: 0,
     rtl: !1,
     deepLink: null,
     deepLinkType: "path",
     disablePlugins: []
     */
    // more slider options goes here...
    // check slider options section in documentation for more options.
  });

});
