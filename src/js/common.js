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
});

//= lib/animated-gradient.js
