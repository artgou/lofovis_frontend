require('../_js/common');
require('./job.less');
const { initUploader, getFileList } = require('../_js/upload');
const { Trim, isMobilePhone, Ajax, Toast, Alert } = require('../_js/tools');

$(function () {
  initUploader(5);

  // 提交数据
  function onSubmitFrom(evt) {
    evt.preventDefault();
    let position = Trim($('#position').val());
    if (!position) {
      return layer.msg('请选择应聘职位');
    }
    let status = Trim($('#status').val());
    if (!status) {
      return layer.msg('请选择目前状态');
    }
    let name = Trim($('#name').val());
    if (!name) {
      return layer.msg('请输入姓名');
    }
    let contact = Trim($('#contact').val());
    if (!contact) {
      return layer.msg('请输入联系电话或微信');
    }
    let email = Trim($('#email').val());
    if (!email) {
      return layer.msg('请输入Email');
    }
    const reqData = new FormData();
    reqData.append('position', position);
    reqData.append('status', status);
    reqData.append('name', name);
    reqData.append('contact', contact);
    reqData.append('email', email);
    const fileList = getFileList();
    if (fileList && fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        reqData.append('file_' + i, fileList[i]);
      }
    }
    Ajax('POST', `/web/about/job`, reqData, ({ errno, errmsg, data }) => {});
    return false;
  }

  let $form = $('#form');
  $form.submit(onSubmitFrom);
  $form.find('#btnSubmit').click(onSubmitFrom);
  $form.keydown(function (evt) {
    if (evt.keyCode == 13) {
      $(this).submit();
      return false;
    }
  });
});
