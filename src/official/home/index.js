require('./index.less');

$(function () {
  // 设置懒加载并fix首屏
  $('img.lazy').lazyload({ effect: 'fadeIn' });
  setTimeout(function () {
    $(window).trigger('resize');
  }, 100);

  if (window.Swiper) {
    var swiper = new Swiper('.swiper-container', {
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
});
