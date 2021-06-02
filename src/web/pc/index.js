require('./index.less');

$(function () {
  const $dom = $('#qrcode');
  const value = $dom.data('value');
  const size = $dom.data('size') || 128;
  const colorDark = $dom.data('colorDark') || '#000000';
  const colorLight = $dom.data('colorLight') || '#ffffff';
  new QRCode($dom.get(0), {
    text: value,
    width: size,
    height: size,
    colorDark: colorDark,
    colorLight: colorLight,
    correctLevel: QRCode.CorrectLevel.H,
  });
});
