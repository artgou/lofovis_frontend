require('../_js/common');
require('./index.less');

$(function () {
  //提交
  function submit() {
    const fileList = getFileList();
    console.log({ fileList });
  }

  $('#btnSubmit').on('click', submit);
});
