$(function () {
  // 设置懒加载并fix首屏
  $('img.lazy').lazyload({ effect: 'fadeIn' });
  setTimeout(function () {
    $(window).trigger('resize');
  }, 100);

  if (window.Swiper) {
    new Swiper('.swiper-container', {
      direction: 'vertical',
      lazy: {
        loadPrevNext: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }

  window.scrollReveal = new scrollReveal({
    origin: 'bottom',
    distance: '50px',
    delay: 0,
  });

  // var navOffset = $('.article-list').offset().top;
  if ($.find('.auto-menu').length > 0) {
    $(window).scroll(function () {
      var scrollPos = $(window).scrollTop();
      if (scrollPos >= 500) {
        $('.page-menu').fadeIn(500).css('display', 'flex');
      } else {
        $('.page-menu').fadeOut(500);
        $('#aside').fadeOut();
      }
    });
  }

  $('#aside .icon').click(function () {
    const dist = parseInt($(this).data('dist'));
    const dom = $('#asideItems');
    const top = dom.scrollTop();
    dom.animate({ scrollTop: top + dist }, 500);
  });

  $('#btnNews').click(function () {
    const aside = $('#aside');
    const newsList = $('#newsList');
    if (aside.is(':hidden')) {
      aside.fadeIn().css('display', 'flex');
      newsList.addClass('article-list-offset');
    } else {
      aside.fadeOut();
      newsList.removeClass('article-list-offset');
    }
  });
});
