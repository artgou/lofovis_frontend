require('../common/common');
require('./job.less');

$(function () {
  let picmax = 5; //限制上传数量
  function imgChange() {
    let file = document.getElementById('upload').files;
    let imglist = document.querySelectorAll('.upload-item');
    let list = document.getElementsByClassName('upload-list')[0];
    let filelist =
      file.length + imglist.length > picmax ? 9 - imglist.length : file.length + imglist.length;
    if (file.length + imglist.length >= 9) {
      let uploadfile = document.getElementsByClassName('upload-file')[0];
      uploadfile.style.display = 'none';
    }
    for (let i = 0; i < filelist; i++) {
      readerfile(file[i]).then((e) => {
        let html = document.createElement('div');
        html.className = 'upload-item';
        html.innerHTML = '<img src=' + e + ' alt="pic">';
        list.appendChild(html);
      });
    }
  }

  $('#upload').on('change', imgChange);

  function readerfile(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.addEventListener(
        'load',
        function () {
          resolve(reader.result);
        },
        false
      );
      if (file) {
        reader.readAsDataURL(file);
      }
    });
  }

  //提交
  function submit() {
    let imglist = [];
    let text = document.getElementsByClassName('upload-textarea')[0].value;
    let list = document.querySelectorAll('.upload-item');
    for (let i = 0; i < list.length; i++) {
      imglist.push(list[i].lastChild.src);
    }
    console.log('发布内容：', text);
    console.log('图片列表：', imglist);
  }

  //textarea高度自适应
  var autoTextarea = function (elem, extra, maxHeight) {
    extra = extra || 0;
    var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
      isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
      addEvent = function (type, callback) {
        elem.addEventListener
          ? elem.addEventListener(type, callback, false)
          : elem.attachEvent('on' + type, callback);
      },
      getStyle = elem.currentStyle
        ? function (name) {
            var val = elem.currentStyle[name];

            if (name === 'height' && val.search(/px/i) !== 1) {
              var rect = elem.getBoundingClientRect();
              return (
                rect.bottom -
                rect.top -
                parseFloat(getStyle('paddingTop')) -
                parseFloat(getStyle('paddingBottom')) +
                'px'
              );
            }

            return val;
          }
        : function (name) {
            return getComputedStyle(elem, null)[name];
          },
      minHeight = parseFloat(getStyle('height'));

    elem.style.resize = 'none';

    var change = function () {
      var scrollTop,
        height,
        padding = 0,
        style = elem.style;

      if (elem._length === elem.value.length) return;
      elem._length = elem.value.length;

      if (!isFirefox && !isOpera) {
        padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
      }
      scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

      elem.style.height = minHeight + 'px';
      if (elem.scrollHeight > minHeight) {
        if (maxHeight && elem.scrollHeight > maxHeight) {
          height = maxHeight - padding;
          style.overflowY = 'auto';
        } else {
          height = elem.scrollHeight - padding;
          style.overflowY = 'hidden';
        }
        style.height = height + extra + 'px';
        scrollTop += parseInt(style.height) - elem.currHeight;
        document.body.scrollTop = scrollTop;
        document.documentElement.scrollTop = scrollTop;
        elem.currHeight = parseInt(style.height);
      }
    };

    // addEvent('propertychange', change);
    // addEvent('input', change);
    // addEvent('focus', change);
    change();
  };
});
