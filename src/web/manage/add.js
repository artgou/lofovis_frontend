require('../_js/common');
require('./add.less');
const { initUploader, getFileList, uploadToQiniu } = require('../_js/upload');
const { Int, Trim, Ajax, isEmail } = require('../_js/tools');

$(function () {
  const uploadMax = Int($('.upload-list').data('max')) || 10;
  initUploader(uploadMax);

  // 提交数据
  async function onSubmitFrom(evt) {
    evt.preventDefault();
    let type = Int($('#type').val());
    if (!type) {
      return layer.msg('请选择内容属性');
    }
    let category_id = Int($('#category_id').val());
    if (!category_id) {
      return layer.msg('请选择文章分类');
    }
    let title = Trim($('#title').val());
    if (!title) {
      return layer.msg('请输入文章标题');
    }
    let content = Trim($('#content').val());
    // const reqData = new FormData();
    // reqData.append('type', type);
    // reqData.append('category_id', category_id);
    // reqData.append('title', title);
    // reqData.append('content', content);
    // 文件
    const fileList = getFileList();
    const typeNames = {
      2: {
        label: '图片',
        min: 1,
        max: 6,
      },
      3: {
        label: '视频',
        min: 1,
        max: 1,
      },
    };
    const item = typeNames[type];
    const count = fileList.length;
    if (count < item.min) {
      return layer.msg(`必须上传 ${item.min} 个${item.label}`);
    } else if (count > item.max) {
      return layer.msg(`最多允许上传 ${item.max} 个${item.label}`);
    }
    // for (let i = 0; i < count; i++) {
    //   reqData.append('file_' + i, fileList[i]);
    // }
    // reqData.append('files', files);

    // 判断视频比例
    function checkVideoStyle(fileList) {
      return new Promise((resolve, reject) => {
        var file = fileList ? fileList[0] : null;
        if (file && !/\.(mp4|avi)$/.test(file.name)) {
          return resolve(0);
        }
        try {
          var reader = new FileReader();
          reader.addEventListener(
            'load',
            function () {
              var dataUrl = reader.result;
              var videoId = 'tempVideo';
              var $videoEl = $('<video id="' + videoId + '" style="display: none;"></video>');
              $('body').append($videoEl);
              $videoEl.attr('src', dataUrl);
              var videoTagRef = $videoEl[0];
              videoTagRef.addEventListener('loadedmetadata', function (e) {
                const width = videoTagRef.videoWidth;
                const height = videoTagRef.videoHeight;
                $videoEl.remove();
                resolve(width < height ? 1 : 0);
              });
            },
            false
          );
          reader.readAsDataURL(file);
        } catch (err) {
          layer.msg(`获取文件信息出错`);
          reject(err);
        }
      });
    }
    const video_style = await checkVideoStyle(fileList);
    const files = await uploadToQiniu('web_article', fileList);
    const reqData = {
      type,
      category_id,
      title,
      content,
      files,
      video_style,
    };
    Ajax('POST', `/web/manage/add`, reqData, ({ errno, errmsg, data }) => {});
    return false;
  }
  let $form = $('#form');
  $form.submit(onSubmitFrom);
  $form.find('#btnSubmit').click(onSubmitFrom);
  $form.keydown(function (evt) {
    if (evt.keyCode == 13 && evt.target.tagName !== 'TEXTAREA') {
      $(this).submit();
      return false;
    }
  });
});
