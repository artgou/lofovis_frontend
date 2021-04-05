require('./detail.less');
require('../_js/common');
const { initVideo } = require('../_js/video.js');
const { initAudio } = require('../_js/audio.js');

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
    // effect: 'fade',
    lazy: {
      loadPrevNext: true,
    },
    autoplay: {
      delay: 3000,
      stopOnLastSlide: false,
      disableOnInteraction: false,
    },
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

  if ($('.audio').length) {
    const { setMute } = initAudio();
    setMute(true);
  }
});
