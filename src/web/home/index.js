const PullLoad = require('rjs-pullload');
require('rjs-pullload/dist/style.css');

require('./index.less');
require('../_js/common');
const { Ajax } = require('../_js/tools');
const { rollNumber } = require('../_js/number');

$(function () {
  // 列表
  const pullLoad = PullLoad({
    pullDown: false,
    pullUp: true,
    qName: '.pullload',
    bodyQName: '.pullload-body',
    reqMethod: 'POST',
    reqUrl: '/web/article/list',
    reqArgs: {},
    reqAjaxFn: Ajax,
    itemRenderFn: (item, index) => item,
    dataUpdateEndFn: updateBetween,
  });

  $('.stats-nums').each(function (dom) {
    rollNumber($(this), {});
  });

  function updateBetween() {
    $('.between').each((i, dom) => {
      const tmp = $(dom);
      tmp.html(tmp.html().split('').join(' '));
    });
  }
  updateBetween();
});
