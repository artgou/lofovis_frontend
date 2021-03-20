require('../_js/common');
const { initUploader, getFileList } = require('../_js/upload');
require('./job.less');

$(function () {
  initUploader(5);

  //提交
  function submit() {
    const fileList = getFileList();
    console.log({ fileList });
  }

  $('#btnSubmit').on('click', submit);
});
