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
    const data = new FormData();
    data.append('position', position);
    data.append('status', status);
    data.append('name', name);
    data.append('contact', contact);
    data.append('email', email);
    const fileList = getFileList();
    if (fileList && fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        data.append('file_' + i, fileList[i]);
      }
    }
    // layer.open({
    //   title: '在线调试',
    //   content: '可以填写任意的layer代码',
    // });
    Ajax('POST', `/web/about/job`, data, ({ errno, errmsg, data }) => {
      if (errno === 0) {
        Alert.success('数据提交成功', null, ['确定'], (btnIndex) => {
          window.location.href = data.backurl || '/';
        });
      }
    });
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
