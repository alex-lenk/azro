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


/**
 *
 * BEGIN parallax effect
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
