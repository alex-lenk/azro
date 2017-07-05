$(document).ready(function () {
  $(".nav-left_toggle").click(function () {
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

  // = init/jquery-ui-init.js

  // = init/nav-left.js

  // $('#scene').parallax();
});

//= init/transformicons.js

//= init/animated-gradient.js

//= init/volume-control

//= init/full-page-control.js
