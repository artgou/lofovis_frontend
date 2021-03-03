require('./contact.less')

$(function () {
  // 公司地图
  const companyName = $('#map').data('name')
  if (companyName) {
    // 百度地图API功能
    const map = new BMap.Map('map')
    map.enableScrollWheelZoom()
    map.enableContinuousZoom()
    const local = new BMap.LocalSearch(map, {
      renderOptions: {
        map: map
      }
    })
    local.search(companyName)
  }
  // 复制地址
  const clipboard = new ClipboardJS('.contact-text')
  clipboard.on('success', function (e) {
    e.clearSelection()
    const $copyBtn = $('.yq-url')
    if (!$copyBtn.hasClass('active')) {
      $copyBtn.addClass('active')
    }
    swal('', '公司地址复制成功', 'success')
  })
});