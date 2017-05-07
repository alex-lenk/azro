$(document).ready(function () {
    $(function () {
        $("a[href^='#']").click(function () {
            var _href = $(this).attr("href");
            $("html, body").animate({scrollTop: $(_href).offset().top + "px"});
            return false;
        });
    });

// установливаем обработчик события resize
    $(window).resize(function () {
        $(".header-full .container").css("height", $(window).height());
    });

// вызовем событие resize
    $(window).resize();
});

$(function () {
    //scroll to top
    $('.to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 500);
        return false;
    });

    //show up-button
    $(document).scroll(function () {
        var y = $(this).scrollTop();
        if (y > 800) {
            $('.to-top').removeClass('hidden');
        } else {
            $('.to-top').addClass('hidden');
        }
    });
});

//show up-button
$(document).scroll(function () {
    var y = $(this).scrollTop();
    if (y > 800) {
        $('.to-top').fadeIn();
    } else {
        $('.to-top').fadeOut();
    }
});