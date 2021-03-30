export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 去除左右两边的空格
 * @param str
 * @returns {*|void|string}
 * @constructor
 */
export function Trim(str) {
  return (str || '').toString().replace(/(^\s*)|(\s*$)/g, '');
}

/**
 * string -> int
 * @param val
 * @returns {*}
 */
export function Int(val) {
  val = parseInt(Number(val), 10);
  return isNaN(val) ? 0 : val;
}

/**
 * string -> float
 * @param val
 * @param len
 * @param returnStr 是否返回字符串
 * @returns {*}
 */
export function Float(val, len = 2, returnStr = false) {
  val = parseFloat(Number(val));
  val = isNaN(val) ? 0 : val;
  if (!returnStr) {
    let tmp = Math.pow(10, len);
    return Math.round(val * tmp) / tmp;
  }
  return val.toFixed(len);
}

/**
 * 列表分隔成子数组
 * @param arr
 * @param cols
 */
export function arrayChunk(arr, cols = 1) {
  let chunks = [];
  if (arr) {
    let count = Math.ceil(arr.length / cols);
    while (count > 0) {
      chunks.push(arr.slice((count - 1) * cols, count * cols));
      count--;
    }
  }
  return chunks.reverse();
}

// 修改地址参数
export function changeURLParam(url, key, val) {
  if (!url) {
    url = typeof window != 'undefind' ? window.location.href : '';
  }
  let kv = key + '=' + val;
  if (url.indexOf('?') === -1) url += '?';
  if (url.match(key + '=([^&]*)')) {
    url = url.replace(eval('/[?](' + key + '=)([^&]*)/g'), '?' + kv).replace(eval('/[&](' + key + '=)([^&]*)/g'), '&' + kv);
  } else {
    url += '&' + kv;
  }
  return url;
}

// 判断是否为手机号
export function isMobileNo(mobile) {
  return /^[1][0-9]{10}$/.test(mobile);
}

// 判断是否为电话号码
export function isTelNo(tel) {
  const reg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
  return !!reg.test(tel);
}

export function isMobilePhone(mobile, evt) {
  if (!isMobileNo(mobile)) {
    if (!evt) {
      layer.msg('手机号码格式错误');
    } else {
      layer.msg('手机号码格式错误');
      evt.preventDefault();
    }
    return false;
  }
  return true;
}

// 是否邮箱
export function isEmail(str) {
  let pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
  return pattern.test(str);
}

const checkRespData = (retData, success = true) => {
  if (retData && retData.okmsg) {
    if (retData.backurl) {
      return (window.location.href = retData.backurl);
    } else if (retData.refresh) {
      return window.location.reload();
    }
    // return this.success({ okmsg: '这是okmsg提示', okbtns: '确定,取消', okurls: ['https://baidu.com', '/'] });
    const btnArr = Array.isArray(retData.okbtns) ? retData.okbtns : (retData.okbtns || '确定').split(',');
    const urlArr = Array.isArray(retData.okurls) ? retData.okurls : (retData.okurls || '').split(',');
    const funcs = {};
    if (btnArr && btnArr.length) {
      for (let i = 0; i < btnArr.length; i++) {
        if (urlArr[i]) {
          funcs['btn' + (i + 1)] = function () {
            if (urlArr[i] === 'refresh') {
              window.location.href = window.location.href;
            } else {
              window.location.href = urlArr[i];
            }
          };
        }
      }
    }
    const args = Object.assign(
      {
        title: '系统提示',
        closeBtn: 0,
        btn: btnArr,
      },
      funcs
    );
    layer.confirm(retData.okmsg, args);
  } else if (retData.backurl) {
    window.location.href = retData.backurl;
  } else if (retData.refresh) {
    window.location.reload();
  }
};

/**
 * 异步请求数据
 * @param method
 * @param url
 * @param data
 * @param onSuccess
 * @param onError
 * @param button    需要改变状态的按钮
 * @param ajaxOptions   参数列表{k->v}
 */
export function Ajax(method, url, data, onSuccess, onError, ajaxOptions = null, button = null) {
  method = method.toLowerCase();
  var dataType = 'json';
  if (ajaxOptions && ajaxOptions.dataType) {
    dataType = ajaxOptions.dataType.toLowerCase();
  }
  // 添加当前页地址，便于登录后返回
  const backurl = window.location.href;
  if (!data) data = {};
  data.backurl = backurl;
  var loadingIndex = layer.load(1);
  $('input').blur();
  var ajaxParams = {
    url: url,
    data: data,
    type: method,
    dataType: dataType,
    cache: false,
    timeout: 180000, // ms
    xhrFields: {
      withCredentials: true,
    },
    traditional: true,
    beforeSend: (req) => {
      req.setRequestHeader('X-Token', $('meta[name=x-token]').attr('content'));
    },
    success(ret) {
      var errno = 0;
      var errmsg = null;
      var retData = null;
      if (dataType == 'json') {
        errno = ret.errno || 0;
        errmsg = ret.errmsg;
        retData = ret.data;
        if (typeof errmsg == 'object') {
          // 数据验证结果
          if (ret.errno == 4) {
            var msgList = [];
            for (var k in errmsg) {
              msgList.push(errmsg[k]);
            }
            errmsg = msgList.join('<br>');
            return layer.msg(errmsg, '数据验证失败');
          } else {
            // errmsg = JSON.stringify(errmsg);
          }
        }
      }
      if (!errmsg && typeof retData == 'string') {
        errmsg = retData;
      }
      if (errno == 0) {
        if (errmsg === 'modal' && showModal) {
          return showModal(retData.url, retData.html, retData.title, retData.btnArr, retData.modalOps);
        }
        if (errmsg && errmsg !== 'NOMSG') {
          layer.msg(errmsg);
        } else {
          checkRespData(retData);
        }
      } else {
        if (errmsg && errmsg.okmsg) {
          checkRespData(errmsg, false);
        } else {
          // layer.msg(errmsg || '未知错误!');
          layer.open({
            content: errmsg || '未知错误!',
            title: '系统提示',
          });
        }
      }
      if (onSuccess) {
        onSuccess(ret);
      }
    },
    error(res, error) {
      var errno = 999;
      var errmsg = null;
      if (res.status === 404) {
        errmsg = res.statusText + '<br>' + url;
      } else if (res.responseJSON) {
        errno = res.responseJSON.errno;
        errmsg = res.responseJSON.errmsg;
      } else if (res.responseText) {
        errmsg = res.responseText;
      } else if (error) {
        errmsg = '请求错误：' + error;
      } else {
        errmsg = res.responseText || res.statusText;
      }
      if (errmsg == 'timeout') {
        errmsg = '请求超时!';
      }
      layer.msg(errmsg);
      if (onError) {
        onError(errmsg, errno);
      }
    },
    complete() {
      layer.close(loadingIndex);
    },
  };
  if (ajaxOptions) {
    Object.assign(ajaxParams, ajaxOptions);
  }
  if (data && data.toString() == '[object FormData]') {
    ajaxParams = Object.assign(ajaxParams, {
      async: false,
      contentType: false,
      processData: false,
    });
  }
  $.ajax(ajaxParams);
}

Ajax.get = function (url, data, onSuccess, onError, dataType, options = null, button = null) {
  let args = Array.apply(this, arguments);
  args.unshift('get');
  Ajax.apply(this, args);
};
Ajax.post = function (url, data, onSuccess, onError, dataType, options = null, button = null) {
  let args = Array.apply(this, arguments);
  args.unshift('post');
  Ajax.apply(this, args);
};
Ajax.put = function (url, data, onSuccess, onError, dataType, options = null, button = null) {
  let args = Array.apply(this, arguments);
  args.unshift('put');
  Ajax.apply(this, args);
};
Ajax.delete = function (url, data, onSuccess, onError, dataType, options = null, button = null) {
  let args = Array.apply(this, arguments);
  args.unshift('delete');
  Ajax.apply(this, args);
};
