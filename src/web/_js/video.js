export function initVideo() {
  var isMobile = !!navigator.userAgent.match(/mobile/i);
  var playerVideo = $('.vplayer video');
  var playerIcon = $('.vplayer-icon');
  var playerBar = $('.vplayer .vplayer-bar');
  var playerBarVisible = false;
  var playPause = $('.vplayer .play-pause');
  var timeCurrent = $('.vplayer .timebar-current');
  var timeTotal = $('.vplayer .timebar-total');
  var progressBar = $('.vplayer .timebar .progress-bar');
  var iconVolume = $('.vplayer .icon-volume');
  var volumeProgBar = $('.vplayer .volumebar .volumewrap').find('.progress-bar');
  var videoContent = $('.vplayer-content');
  var videoContentBg = $('.vplayer-content-bg');
  var video = playerVideo[0];
  // 默认静音自动播放
  function autoPlayByMuted() {
    setMute(true);
    doPlay();
    showPlayerBar(false);
  }
  autoPlayByMuted();
  volumeControl(null, 60);
  videoContentBg.on('click', function () {
    setPlayInline(true);
    checkPlayControl();
  });
  playPause.on('click', function () {
    setPlayInline(true);
    checkPlayControl();
  });
  videoContent.on('click', function (e) {
    if (e.target === video || e.target === videoContent[0]) {
      if (video.isPlaying) {
        if (playerBarVisible) {
          playerIcon.fadeOut();
        } else {
          playerIcon.fadeIn();
        }
        showPlayerBar(!playerBarVisible);
      } else {
        checkPlayControl();
      }
    }
  });
  // .hover(
  //   function () {
  //     showPlayerBar(true);
  //   },
  //   function () {
  //     showPlayerBar(false);
  //   }
  // );

  $(document).click(function () {
    $('.volumebar').hide();
  });
  playerVideo.on('loadedmetadata', function () {
    timeTotal.text(formatSeconds(video.duration));
  });
  playerVideo.on('timeupdate', function () {
    timeCurrent.text(formatSeconds(video.currentTime));
    progressBar.css('width', (100 * video.currentTime) / video.duration + '%');
  });
  playerVideo.on('play', function () {
    video.isPlaying = true;
    doPlay();
  });
  playerVideo.on('pause', function () {
    video.isPlaying = false;
    doPause();
  });
  playerVideo.on('seeking', function () {});
  // 查找结束。当用户已经移动/跳跃到视频中新的位置时触发
  playerVideo.on('seeked', function () {});
  // 视频加载等待。当视频由于需要缓冲下一帧而停止，等待时触发
  playerVideo.on('waiting', function () {});
  // 当视频在已因缓冲而暂停或停止后已就绪时触发
  playerVideo.on('playing', function () {});
  playerVideo.on('ended', function () {
    playerIcon.fadeIn();
    playPause.removeClass('icon-play').removeClass('icon-pause').addClass('icon-replay').fadeIn();
  });
  $(window).keyup(function (event) {
    event = event || window.event;
    if (event.keyCode == 32) checkPlayControl();
    event.preventDefault();
  });

  //全屏
  $('.icon-fullscreen').on('click', function () {
    if (isMobile) {
      setPlayInline(false);
      if (video.isPlaying) {
        video.pause();
        setTimeout(doPlay, 50);
      } else {
        doPlay();
      }
      return;
    }
    if ($(this).hasClass('cancleScreen')) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozExitFullScreen) {
        document.mozExitFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    } else {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    }
    return false;
  });
  //音量
  iconVolume.on('click', function (e) {
    e = e || window.event;
    if (isMobile) {
      setMute(iconVolume.hasClass('icon-volume'));
    } else {
      $('.volumebar').toggle();
    }
    e.stopPropagation();
  });
  $('.volumebar').on('click mousewheel DOMMouseScroll', function (e) {
    e = e || window.event;
    volumeControl(e);
    e.stopPropagation();
    return false;
  });

  $('.vplayer .timebar .progress').mousedown(function (e) {
    e = e || window.event;
    e.stopPropagation();
    e.preventDefault();
    updateTimeBar(e.pageX);
  });
  //$('.vplayer-content').on('mousewheel DOMMouseScroll',function(e){
  //  volumeControl(e);
  //});
  var updateTimeBar = function (x) {
    var maxtimeTotal = video.duration; //Video
    var positions = x - progressBar.offset().left; //Click pos
    var percentage = (100 * positions) / $('.vplayer .timebar .progress').width();
    //Check within range
    if (percentage > 100) {
      percentage = 100;
    }
    if (percentage < 0) {
      percentage = 0;
    }
    //Update progress bar and video currenttime
    progressBar.css('width', percentage + '%');
    video.currentTime = (maxtimeTotal * percentage) / 100;
  };
  // 音量控制
  function volumeControl(e, percentage = 0) {
    if (e) {
      e = e || window.event;
      e.stopPropagation();
      e.preventDefault();
      var eventype = e.type;
      var positions = 0;
      percentage = 0;
      if (eventype == 'click') {
        positions = volumeProgBar.offset().top - e.pageY;
        percentage = (100 * (positions + volumeProgBar.height())) / $('.volumebar .volumewrap').height();
      }
      setMute(false);
    }
    if (percentage >= 100) {
      percentage = 100;
    }
    $('.volumewrap .progress-bar').css('height', percentage + '%');
    video.volume = percentage / 100;
  }

  // 显示控制条
  function showPlayerBar(visible) {
    playerBarVisible = visible;
    playerBar.stop().animate(
      {
        bottom: visible ? 0 : -80,
      },
      200
    );
  }

  // 设置静音
  function setMute(val) {
    if (val) {
      video.muted = true;
      iconVolume.removeClass('icon-volume').addClass('icon-volume-off');
    } else {
      video.muted = false;
      iconVolume.removeClass('icon-volume-off').addClass('icon-volume');
    }
  }

  // 设为页内播放
  function setPlayInline(isInline) {
    if (isInline) {
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
    } else {
      video.removeAttribute('playsinline');
      video.removeAttribute('webkit-playsinline');
    }
  }

  function checkPlayControl() {
    if (video.ended || video.paused) {
      doPlay();
    } else {
      doPause();
    }
  }

  function doPlay() {
    video.isPlaying = true;
    video.play();
    videoContentBg.hide();
    playerVideo.show();
    playerIcon.fadeOut();
    playPause.removeClass('icon-replay').removeClass('icon-play').addClass('icon-pause').fadeIn();
  }

  function doPause() {
    video.isPlaying = false;
    video.pause();
    videoContentBg.show();
    playerVideo.hide();
    playerIcon.fadeIn();
    playPause.removeClass('icon-replay').removeClass('icon-pause').addClass('icon-play').fadeIn();
  }

  //秒转时间
  function formatSeconds(value) {
    value = parseInt(value);
    var time;
    if (value > -1) {
      var hour = Math.floor(value / 3600);
      var min = Math.floor(value / 60) % 60;
      var sec = value % 60;
      var day = parseInt(hour / 24);
      if (day > 0) {
        hour = hour - 24 * day;
        time = day + 'day ' + hour + ':';
      } else time = hour + ':';
      if (min < 10) {
        time += '0';
      }
      time += min + ':';
      if (sec < 10) {
        time += '0';
      }
      time += sec;
    }
    return time;
  }

  // this.setMute = setMute;
  // this.doPlay = doPlay;
  // this.doPause = doPause;

  return { setMute, doPlay, doPause, video };
}
