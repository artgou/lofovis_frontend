require('../_js/common');
require('./login.less');
const { Trim, Ajax } = require('../_js/tools');

$(function () {
  // 提交数据
  function onSubmitFrom(evt) {
    evt.preventDefault();
    let uname = Trim($('#uname').val());
    if (!uname) {
      return layer.msg('请输入用户名(帐号)');
    }
    let upass = Trim($('#upass').val());
    if (!upass) {
      return layer.msg('请输入密码');
    }
    let captcha = Trim($('#captcha').val());
    if (!captcha) {
      return layer.msg('请输入验证码');
    }
    Ajax('POST', `/web/manage/login`, { uname, upass, captcha }, (ret) => {
      if (ret.errno !== 0) {
        $('#captcha').val('');
        document.getElementById('captchSVG').src = document.getElementById('captchSVG').src;
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
