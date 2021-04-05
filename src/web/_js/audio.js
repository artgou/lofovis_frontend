export function initAudio() {
  var playerAudio = $('audio');
  var playPause = $('.play-pause');
  var timeCurrent = $('.timebar-current');
  var timeTotal = $('.timebar-total');
  var progressBar = $('.timebar .progress-bar');
  var iconVolume = $('.icon-volume');
  var audio = playerAudio[0];
  audio.load();
  // 默认静音自动播放
  playPause.on('click', function () {
    checkPlayControl();
  });
  playerAudio.on('canplay', function () {
    timeTotal.text(formatSeconds(audio.duration));
  });
  playerAudio.on('timeupdate', function () {
    timeCurrent.text(formatSeconds(audio.currentTime));
    progressBar.css('width', (100 * audio.currentTime) / audio.duration + '%');
  });
  playerAudio.on('play', function () {
    doPlay();
  });
  playerAudio.on('pause', function () {
    doPause();
  });
  playerAudio.on('ended', function () {
    playPause.removeClass('icon-play').removeClass('icon-pause').addClass('icon-replay').fadeIn();
  });
  $(window).keyup(function (event) {
    event = event || window.event;
    if (event.keyCode == 32) checkPlayControl();
    event.preventDefault();
  });
  iconVolume.on('click', function (e) {
    e = e || window.event;
    if (iconVolume.hasClass('icon-volume')) {
      audio.muted = true;
      iconVolume.removeClass('icon-volume').addClass('icon-volume-off');
    } else {
      audio.play();
      audio.muted = false;
      iconVolume.removeClass('icon-volume-off').addClass('icon-volume');
    }
    e.stopPropagation();
  });

  $('.timebar .progress').mousedown(function (e) {
    e = e || window.event;
    e.stopPropagation();
    e.preventDefault();
    updateTimeBar(e.pageX);
  });
  var updateTimeBar = function (x) {
    var maxtimeTotal = audio.duration; //Video
    var positions = x - progressBar.offset().left; //Click pos
    var percentage = (100 * positions) / $('.timebar .progress').width();
    //Check within range
    if (percentage > 100) {
      percentage = 100;
    }
    if (percentage < 0) {
      percentage = 0;
    }
    //Update progress bar and video currenttime
    progressBar.css('width', percentage + '%');
    audio.currentTime = (maxtimeTotal * percentage) / 100;
  };

  function checkPlayControl() {
    if (audio.ended || audio.paused) {
      doPlay();
    } else {
      doPause();
    }
  }

  function doPlay() {
    audio.play();
    playPause.removeClass('icon-replay').removeClass('icon-play').addClass('icon-pause').fadeIn();
  }

  function doPause() {
    audio.pause();
    playPause.removeClass('icon-replay').removeClass('icon-pause').addClass('icon-play').fadeIn();
  }

  // 设置静音
  function setMute(val) {
    if (val) {
      audio.muted = true;
      iconVolume.removeClass('icon-volume').addClass('icon-volume-off');
    } else {
      audio.muted = false;
      iconVolume.removeClass('icon-volume-off').addClass('icon-volume');
    }
  }

  //秒转时间
  function formatSeconds(value) {
    value = parseInt(value);
    let min = Math.floor(value / 60) % 60;
    let sec = value % 60;
    let str = '';
    if (sec > 0) {
      str += `${sec}''`;
    }
    if (min > 0) {
      str += `${min}`;
    }
    return str;
  }

  return { setMute, audio };
}
