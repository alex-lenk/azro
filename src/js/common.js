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
    hybrid:true,
    fitToSection: false
  });
});

//= init/transformicons.js

//= init/animated-gradient.js
