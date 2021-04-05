const { Ajax } = require('./tools');

$(function () {
  // 设置懒加载并fix首屏
  $('img.lazy').lazyload({ effect: 'fadeIn' });
  setTimeout(function () {
    $(window).trigger('resize');
  }, 100);

  if (window.Swiper) {
    new Swiper('.swiper-container.page-swiper', {
      direction: 'vertical',
      // effect: 'fade',
      lazy: {
        loadPrevNext: true,
      },
      autoplay: {
        delay: 3000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }

  window.scrollReveal = new scrollReveal({
    origin: 'bottom',
    distance: '0px',
    delay: 0,
  });

  var navOffset = $('.page-swiper').height();
  if ($.find('.auto-menu').length > 0) {
    $(window).scroll(function () {
      var scrollPos = $(window).scrollTop();
      if (scrollPos >= navOffset) {
        $('.page-menu').fadeIn(500).css('display', 'flex');
      } else {
        $('.page-menu').fadeOut(500);
        $('#aside').fadeOut();
        const pageBody = $('.page-offset');
        pageBody.removeClass('page-offset-yes');
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
    const pageBody = $('.page-offset');
    if (aside.is(':hidden')) {
      aside.fadeIn().css('display', 'flex');
      pageBody.addClass('page-offset-yes');
    } else {
      aside.fadeOut();
      pageBody.removeClass('page-offset-yes');
    }
  });

  $('.btn-fav').click(function () {
    const sn = $(this).data('sn');
    Ajax('POST', `/web/article/fav`, { sn }, (ret) => {
      if (ret.errno === 0) {
        $(this).find('b').html(ret.data.favs);
      }
    });
  });

  $('#btnExit').click(function () {
    layer.confirm('确定要退出管理吗？', { title: '系统提示' }, function (index) {
      Ajax('POST', `/web/manage/logout`, null, (ret) => {
        if (ret.errno === 0) {
          // window.location.href = window.location.href;
        }
      });
    });
  });

  $('textarea').on('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });
});
