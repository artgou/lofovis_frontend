require('./index.less');

$(function () {
  if (window.Swiper) {
    var swiper = new Swiper('.swiper-container', {
      direction: 'vertical',
      // spaceBetween: 30,
      // effect: 'fade',
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }
});
