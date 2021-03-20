require('../_js/common');
const { initUploader, getFileList } = require('../_js/upload');
require('./post.less');

$(function () {
  initUploader(7);

  //提交
  function submit() {
    const fileList = getFileList();
    console.log({ fileList });
  }

  $('#btnSubmit').on('click', submit);
});
