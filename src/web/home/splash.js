require('./splash.less');

$(function () {
  const dom = $('.splash-timer');
  let times = parseInt(dom.data('times')) || 10;
  let link = dom.data('link');
  const timerId = setInterval(() => {
    times--;
    if (times <= 0) {
      clearInterval(timerId);
      window.location.href = link;
      return;
    }
    dom.html(times + 'S');
  }, 1000);
});
