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
});
