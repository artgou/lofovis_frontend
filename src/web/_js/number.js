/*
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>jQuery数字滚动到相应的金额</title>
    <style>
        body {
            background-color: #212121
        }

        .rollnums {
            height: 100px;
        }

        .rollnums .rollnums__col {
            float: left;
            list-style: none;
            position: relative;
            overflow: hidden;
            width: 100px;
            height: 100px;
            line-height: 100px;
            margin: 0px 3px;
            font-family: "Arial";
            text-align: center;
            font-size: 100px;
            color: #fff;
            background: #e52e25;
        }

        .rollnums__chars {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .rollnums__chars span {
            width: 100%;
            height: 100%;
            float: left;
        }

        .rollnums__symbol {
            font-size: 69px !important;
            transition: 'none'
        }
    </style>
</head>

<body>
    <div class="nums" data-num="总人数：8"></div>
    <div class="nums" data-num="800"></div>
    <div class="nums" data-num="50"></div>
    <div class="nums" data-num="3.14"></div>
    <div class="nums" data-num="50,000"></div>
    <div class="nums" data-num="132.33"></div>
    <div class="nums" data-num="25,132.33"></div>
</body>
<script src="http://www.jq22.com/jquery/jquery-1.10.2.js"></script>
<script>
  $(function () {
    $(".nums").each(function (dom) {
        rollNumber($(this), {})
    })
  });
</script>
</html>
*/

/**
 * 数字滚动 - 初始
 * @param {*} dom
 * @param {*} options
 */
export function rollNumber(dom, options) {
  options = {
    chars: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ',', '.', ':'], // 数字必须2遍
    className: 'rollnums', // 类名
    digit: 0, // 默认显示几位数字
    // transition: 'all 2.0s ease-in-out' // 动画
    transition: 'all 2.0s cubic-bezier(0.85, 0, 0.15, 1)',
    delay: 100, // 延迟滚动时间,0表示不滚动
    colInterval: 150, // 列步进间隔时间(ms)
  };
  // 初始
  const numStr = dom.data('num').toString();
  const numArr = numStr.split(',');
  let charsHtml = options.chars.map((c) => `<span>${c}</span>`).join('');
  let html = '<ul class="' + options.className + '">';
  if (dom.find('.' + options.className).length <= 0) {
    const len = options.digit || numStr.length;
    for (let i = 0; i < len; i++) {
      html += `<li class="rollnums__col"><div class="rollnums__chars">${charsHtml}</div></li>`;
    }
    html += '</ul>';
    dom.html(html);
  }
  if (options.delay > 0) {
    setTimeout(rollNumberStart, options.delay, dom, options);
  }
}

/**
 * 数字滚动 - 开始
 * @param {*} dom
 * @param {*} options
 */
export function rollNumberStart(dom, options) {
  const numStr = dom.data('num').toString();
  const numDoms = $(dom)
    .find('.' + options.className)
    .find('.rollnums__chars');
  const colHeight = $(dom).find('.rollnums__col').height();
  numDoms.css('transition', options.transition);
  const numberArr = numStr.split('');
  numDoms.each(function (i, item) {
    setTimeout(function () {
      const str = numberArr[i];
      const num = parseInt(str);
      if (num >= 0) {
        numDoms.eq(i).css('top', -num * colHeight - colHeight * 10 + 'px');
      } else {
        numDoms.eq(i).html(str).css({ transition: 'none' }).addClass('rollnums__symbol');
      }
    }, i * options.colInterval);
  });
}
