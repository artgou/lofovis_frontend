require('../_js/common');
require('./list.less');
const { Ajax } = require('../_js/tools');

$(function () {
  $('.item-btn-del').click(function (e) {
    const id = $(this).data('id');
    console.log({ id });

    layer.confirm('确定删除此文章吗？', { title: '系统提示' }, function (index) {
      Ajax('POST', `/web/manage/delete`, { id }, (ret) => {
        if (ret.errno === 0) {
          window.location.href = window.location.href;
        }
      });
    });
  });
});
