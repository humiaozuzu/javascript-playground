var stop = false;
var currentFrame = 1;
var totalFrame = 2170;
var totalTime = 217;
var map;
var audio;


function updateMap() {
  if (currentFrame % 10 == 0) {
    console.log(currentFrame);
    console.log(audio.currentTime);
  }
  var difs = apple[currentFrame].split('|');
  var dif_num = difs.length - 1;
  var dif, x, y, c;
  for (var i = 0; i < dif_num; i++) {
    dif = difs[i].split('_');
    //console.log(dif);
    x = parseInt(dif[0]);
    y = parseInt(dif[1]);
    map[x-1][y-1] = dif[2];
  }
  currentFrame += 1;
}

function badAppleStart() {
  if (currentFrame == totalFrame) {
    currentFrame = 1;
    stop = true;
    audio.pause();
    audio.currentTime = 0;
    $("ul li").removeClass("on");
    $('#play-btn').next().addClass("on"); 
    return;
  }
  else if (stop == true) {
    return;
  }
  updateMap();
  var mapData = [];
  for (var i = 0; i < 50; i++) {
    mapData[i] = map[i].join('');
  }
  document.getElementById('displayarea').value = mapData.join('\n');
  if (audio.currentTime > currentFrame / 10) {
    setTimeout(badAppleStart, 10);
  }
  else {
    setTimeout(badAppleStart, 100);
  }
}

function badAppleInit() {
  // init map
  map = new Array(50);
  for (var i = 0; i < 50; ++i) {
    map[i] = new Array(133);
  }

  currentFrame = 1;
}

var currentFile = 2;
function preload() {

  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.onload = function() {
    console.log('File'+currentFile+'ok');
    preload();
    currentFile += 1;
  }
  s.src = 'res/' + currentFile + '.js';
  document.getElementsByTagName('head')[0].appendChild(s);
}

window.onload = function() {
  audio = document.getElementById('audio');
  preload();
  badAppleInit();

  $("ul li").click(function(event){
    event.preventDefault();
    if ($(this).hasClass('on')) {
      return;
    }
    if ($('#play-btn').hasClass('on')) {
      audio.pause();
      stop = true;
    } else {
      stop = false;
      audio.play();
      badAppleStart();
    }

    $("ul li").removeClass("on");
    $(this).addClass("on"); 
  });
}
