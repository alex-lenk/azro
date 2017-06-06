var navPos, winPos, navHeight, nav = $(".nav-left");

function refreshVar() {
  navPos = nav.offset().top;
  navHeight = nav.outerHeight(true);
}

refreshVar();
$(window).resize(refreshVar);

//$('<div class="clone-nav"></div>').insertBefore(".nav-left").css("height", navHeight).hide();

$(window).scroll(function () {
  winPos = $(window).scrollTop();

  if (winPos >= navPos) {
    nav.addClass("fixed shadow");
    $(".clone-nav").show();
  } else {
    nav.removeClass("fixed shadow");
    $(".clone-nav").hide();
  }
});
