require('./detail.less');

$(function () {
  var outlineSwiper = new Swiper('.swiper-outline', {
    direction: 'vertical',
    noSwipingClass: 'swiper-scroll',
    navigation: {
      prevEl: '.btn-swiper-pre',
      nextEl: '.panel-center',
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
});
