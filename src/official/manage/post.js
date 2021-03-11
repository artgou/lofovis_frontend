require('../common/common');
const { initUploader, getFileList } = require('../common/upload');
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
