$(document).ready(function () {
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


  $(".volume-control").click(function () {
    $('.slider-range').toggleClass("slider-range-open");
  });

  $(".navbar-toggle").click(function () {
    $('.navbar-toggle').toggleClass("navbar-toggle-open");
    $('.nav-panel').toggleClass("nav-panel-open");
  });


  var navPos, winPos, navHeight, nav = $(".nav-left");

  function refreshVar() {
    navPos = nav.offset().top;
    navHeight = nav.outerHeight(true);
  }

  refreshVar();
  $(window).resize(refreshVar);

  $('<div class="clone-nav"></div>')
    .insertBefore(".nav-left")
    .css("height", navHeight)
    .hide();

  $(window).scroll(function() {
    winPos = $(window).scrollTop();

    if (winPos >= navPos) {
      nav.addClass("fixed shadow");
      $(".clone-nav").show();
    } else {
      nav.removeClass("fixed shadow");
      $(".clone-nav").hide();
    }
  });
});
