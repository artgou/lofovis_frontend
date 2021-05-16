require('../_js/common');
require('./job.less');
const { initUploader, getFileList, uploadToQiniu } = require('../_js/upload');
const { Int, Trim, Ajax, isEmail } = require('../_js/tools');

$(function () {
  const uploadMax = Int($('.upload-list').data('max')) || 10;
  initUploader(uploadMax);

  // 提交数据
  async function onSubmitFrom(evt) {
    evt.preventDefault();
    let position_id = Int($('#position_id').val());
    if (!position_id) {
      return layer.msg('请选择应聘职位');
    }
    let job_status = Int($('#job_status').val());
    if (!job_status) {
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
    } else if (!isEmail(email)) {
      return layer.msg('请输入正确的邮箱地址');
    }
    // const reqData = new FormData();
    // reqData.append('position_id', position_id);
    // reqData.append('job_status', job_status);
    // reqData.append('name', name);
    // reqData.append('contact', contact);
    // reqData.append('email', email);
    const fileList = getFileList();
    // if (fileList && fileList.length > 0) {
    //   for (let i = 0; i < fileList.length; i++) {
    //     reqData.append('file_' + i, fileList[i]);
    //   }
    // }
    const files = await uploadToQiniu('web_job', fileList);
    // reqData.append('files', files);
    const reqData = {
      position_id,
      job_status,
      name,
      contact,
      email,
      files,
    };
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
