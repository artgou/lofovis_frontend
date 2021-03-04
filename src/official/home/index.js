require('./index.less');

$(function () {
  var swiper = new Swiper('.swiper-container', {
    direction: 'vertical',
    // spaceBetween: 30,
    // effect: 'fade',
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
});
