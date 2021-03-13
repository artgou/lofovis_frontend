require('./detail.less');

// $(function () {});

$(function () {
  var playerVideo = $('.player video');
  var playerIcon = $('.player-icon');
  var playerBar = $('.player .player-bar');
  var playPause = $('.play-pause');
  var timeCurrent = $('.timebar-current');
  var timeTotal = $('.timebar-total');
  var progressBar = $('.timebar .progress-bar');
  var volumeProgBar = $('.volumebar .volumewrap').find('.progress-bar');
  var video = playerVideo[0];
  video.volume = 0.5;
  playPause.on('click', function () {
    checkPlayControl();
  });
  $('.player-content')
    .on('click', function (e) {
      if (e.target === video) {
        checkPlayControl();
      }
    })
    .hover(
      function () {
        playerBar.stop().animate(
          {
            bottom: 0,
          },
          500
        );
      },
      function () {
        playerBar.stop().animate(
          {
            bottom: -50,
          },
          500
        );
      }
    );
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
  $('.icon-volume').on('click', function (e) {
    e = e || window.event;
    $('.volumebar').toggle();
    e.stopPropagation();
  });
  $('.volumebar').on('click mousewheel DOMMouseScroll', function (e) {
    e = e || window.event;
    volumeControl(e);
    e.stopPropagation();
    return false;
  });
  $('.timebar .progress').mousedown(function (e) {
    e = e || window.event;
    e.stopPropagation();
    e.preventDefault();
    updatebar(e.pageX);
  });
  //$('.player-content').on('mousewheel DOMMouseScroll',function(e){
  //	volumeControl(e);
  //});
  var updatebar = function (x) {
    var maxtimeTotal = video.duration; //Video
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
    video.currentTime = (maxtimeTotal * percentage) / 100;
  };
  //音量控制
  function volumeControl(e) {
    e = e || window.event;
    var eventype = e.type;
    var positions = 0;
    var percentage = 0;
    if (eventype == 'click') {
      positions = volumeProgBar.offset().top - e.pageY;
      percentage = (100 * (positions + volumeProgBar.height())) / $('.volumebar .volumewrap').height();
    }
    if (percentage >= 100) {
      percentage = 100;
    }
    $('.volumewrap .progress-bar').css('height', percentage + '%');
    video.volume = percentage / 100;
    e.stopPropagation();
    e.preventDefault();
  }

  function checkPlayControl() {
    console.log(video.paused, video.ended);
    if (video.ended || video.paused) {
      video.play();
      playerIcon.fadeOut();
      playPause.removeClass('icon-replay').removeClass('icon-play').addClass('icon-pause').fadeIn();
    } else {
      video.pause();
      playerIcon.fadeIn();
      playPause.removeClass('icon-replay').removeClass('icon-pause').addClass('icon-play').fadeIn();
    }
  }
});

//秒转时间
function formatSeconds(value) {
  value = parseInt(value);
  var time;
  if (value > -1) {
    hour = Math.floor(value / 3600);
    min = Math.floor(value / 60) % 60;
    sec = value % 60;
    day = parseInt(hour / 24);
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
