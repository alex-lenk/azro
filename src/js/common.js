$(document).ready(function () {

  $(".nav-left_toggle").click(function () {
    $('.nav-panel').toggleClass("nav-panel-open");
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

});


/**
 *
 * BEGIN volume-control
 *
 * Created on 03.07.17.
 *
 */

//= init/volume-control

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

//= init/full-page-control.js

/**
 *
 * END full-page-control
 *
 */

//= init/transformicons.js

//= init/animated-gradient.js
