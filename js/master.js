$(document).ready(function(){
  var tracks=[{
    title:"Hiding My Heart",
    artist:"Brandi Carlile",
    cover:"assets/cover/Hiding My Heart.jpg",
    source:"assets/track/Hiding My Heart.mp3",
    lyric:""
  },{
    title:"Isn't It Time",
    artist:"The Beach Boys",
    cover:"assets/cover/Isn't it time.jpg",
    source:"assets/track/Isn't It Time.mp3",
    lyric:""
  },{
    title:"喜欢喜欢你",
    artist:"何韵诗",
    cover:"assets/cover/喜欢喜欢你.jpg",
    source:"assets/track/喜欢喜欢你.mp3",
    lyric:""
  }];

  var audio= document.getElementById('audio');
  var currentVolume = 0.9;  //当前音量,默认90%
  var trackIndex = 0;   //当前播放歌曲序号，默认从第一首开始播放
  var isplaying = true;


  //加载歌曲信息
  function loadTrack(trackIndex) {
    track = tracks[trackIndex];
    audio.src = track.source;
    $('#title').text(track.title);
    $('#artist').text(track.artist);
    $('#cover').attr('src',track.cover);
    $('.playlist li a').removeClass('playing');
    $('.playlist li a').eq(trackIndex).addClass('playing');
  }

  function calcTime(time) {
    var minute=parseInt((time % 3600) / 60, 10);
    var second=parseInt(time % 60, 10);
    minute = minute >= 10 ? minute : "0" + minute;
    second = second >= 10 ? second : "0" + second;
    return minute+":"+second;
  }

  function updateProgress() {
    var currentTime = audio.currentTime,
        duration = audio.duration;
    var value = Math.round((currentTime/duration)*100);
    $('#progress').val(value);
    var time=calcTime(Math.floor(audio.currentTime));
    var duration = calcTime(Math.floor(audio.duration));
    $('#time').html(time);
    $('#duration').html(duration);
  }

  function trackPlay() {
    $('#btnPlay i').removeClass('fa-play').addClass('fa-pause');
    $('#cover').removeClass('paused').addClass('active');
    audio.play();
    playing = setInterval(updateProgress, 200);
  }

  function trackPause() {
    $('#btnPlay i').removeClass('fa-pause').addClass('fa-play');
    $('#cover').addClass('paused');
    audio.pause();
    clearInterval(playing);
  }

  //生成并插入播放列表
  for( var i = 0; i < tracks.length; i++ ){
    var track = tracks[i];
    $('.playlist ul').append('<li><a href="'+track.source+'">'+track.title+'-'+track.artist+'</a></li>');
  }

  loadTrack(trackIndex); //读取默认歌曲

  //为进度条绑定点击事件处理函数
  $('#progress').click(function(e){
    var progressStart = $(this).offset().left;
    var progressLength = $(this).width();
    var ratio = (e.clientX - progressStart)/progressLength;
    audio.currentTime = ratio*audio.duration;
    this.value = ratio*100;
    updateProgress();
  });

  //为音量条绑定点击事件处理函数
  $('#volume').click(function(e){
    var volumeStart = $(this).offset().left;
    var volumeLength = $(this).width();
    var ratio = (e.clientX - volumeStart)/volumeLength;
    //静音时点击音量条上不为起点的位置时，改变音量按钮图标
    if(audio.volume == 0 && ratio){
      $('#btnVolume i').removeClass('fa-volume-off').addClass('fa-volume-up');
    }
    audio.volume = ratio;
    this.value = ratio*100;
  });


  $('#btnVolume').click(function(){
    if(audio.volume == 0){
      $('#btnVolume i').removeClass('fa-volume-off').addClass('fa-volume-up');
      audio.volume = currentVolume;
      $('#volume').val(currentVolume * 100);
    } else {
      $('#btnVolume i').removeClass('fa-volume-up').addClass('fa-volume-off');
      currentVolume = audio.volume;
      $('#volume').val("0");
      audio.volume = 0;
    }
  });


  $('.playlist li a').click(function(e){
    audio.src = this.href;
    var trackInfo = $(this).text().split('-');
    $('#title').text(trackInfo[0]);
    $('#artist').text(trackInfo[1]);
    $('#cover').attr('src','assets/cover/'+trackInfo[0]+'.jpg');
    $('.playlist li a').removeClass('playing');
    $(this).addClass('playing');
    trackPlay();
    //阻止默认跳转事件
    return false;
  });

  //播放结束时自动跳转至下一首歌
  audio.addEventListener('ended',function(){
    $('#btnNext').trigger('click');
    trackPlay();
  });


  $('#btnPlay').click(function() {
    if(audio.paused){
      trackPlay();
    } else {
      trackPause();
    }
  });

  $('#btnNext').click(function() {
    ispaused = audio.paused;
    $('#cover').removeClass('active paused');
    //当前播放歌曲为最后一首时
    if (trackIndex === tracks.length-1) {
      trackIndex = 0;
    } else {
      trackIndex += 1;
    }
    loadTrack(trackIndex);
    ispaused ? trackPause() :trackPlay();
  });

  $('#btnPrevious').click(function() {
    ispaused = audio.paused;
    $('#cover').removeClass('active paused');
    //当前播放歌曲为第一首时
    if (trackIndex === 0 ) {
      trackIndex = tracks.length-1
    } else {
      trackIndex -= 1;
    }
    loadTrack(trackIndex);
    ispaused ? trackPause() :trackPlay();
  });

  $('.playlist').hide();

  $('.playlist li:last-child').css('border-bottom','none');

  $('.cover').click(function(){
    $('.playlist').fadeIn(200);
  });

  $('.playlist').click(function(){
    $(this).fadeOut(200);
  });
})
