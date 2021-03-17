require('./detail.less');
const { initVideo } = require('../_js/video.js');
$(function () {
  var outlineSwiper = new Swiper('.swiper-outline', {
    direction: 'vertical',
    noSwipingClass: 'swiper-scroll',
    navigation: {
      prevEl: '.btn-swiper-pre',
      nextEl: '.btn-swiper-next',
    },
  });

  var inlineSwiper = new Swiper('.swiper-inline', {
    direction: 'vertical',
    noSwipingClass: 'swiper-scroll',
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });

  if ($('.vplayer').length) {
    const { doPlay, doPause } = initVideo();
    $('.btn-swiper-pre').click(doPlay);
    $('.btn-swiper-next').click(doPause);
  }

  $('#btnFav').on('click', function (e) {
    // setMute(false);
  });
});
