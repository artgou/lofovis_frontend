require('./detail.less');

$(function () {
  var swiper = new Swiper('.swiper-container', {
    direction: 'vertical',
    noSwipingClass: 'swiper-scroll',
    navigation: {
      prevEl: '.btn-swiper-pre',
    },
  });
});
