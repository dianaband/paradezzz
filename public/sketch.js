/*
global loadSound frameRate background createButton io noCanvas
select createP windowWidth windowHeight random createImg createDiv
AUTO loadJSON createCanvas createRadio selectAll int str
*/

// force https
var http_confirm = location.href.split(":")[0];
if (http_confirm == "http") {
  window.location.replace("https://" + location.host);
}

var socket = io(location.host);
var n = 0;
var fr = 20;
var arr = [];
var voice = [];
var looper;
var score;
let logo;
var silence;

function preload() {
  loadJSON("/score.json", function(json) {
    score = json;
  });
  silence = loadSound("./audio/_silence.wav");
}

function setup() {
  noCanvas();
  frameRate(fr);
  voice[0] = loadSound("./audio/018.mp3");
  voice[1] = loadSound("./audio/011.mp3");
  voice[2] = loadSound("./audio/14.mp3");
  voice[3] = loadSound("./audio/012.mp3");
  voice[4] = loadSound("./audio/17.mp3");
  voice[5] = loadSound("./audio/11.mp3");
  voice[6] = loadSound("./audio/013.mp3");
  voice[7] = loadSound("./audio/022.mp3");
  voice[8] = loadSound("./audio/020.mp3");
  voice[9] = loadSound("./audio/021.mp3");
  voice[10] = loadSound("./audio/014.mp3");
  voice[11] = loadSound("./audio/16.mp3");
  voice[12] = loadSound("./audio/015.mp3");
  voice[13] = loadSound("./audio/18.mp3");
  voice[14] = loadSound("./audio/12.mp3");
  voice[15] = loadSound("./audio/019.mp3");
  voice[16] = loadSound("./audio/13.mp3");
  voice[17] = loadSound("./audio/016.mp3");
  voice[18] = loadSound("./audio/017.mp3");
  voice[19] = loadSound("./audio/023.mp3");
  randomvoiceplay();
}

//
var myroom = -1;
var plogo;
var intro;
var ready;
//
socket.on("connect", function() {
  console.log("connected!");
  //

  if (myroom == -1 && selectAll(".roomsel").length == 0) {
    //initial connection -> ask the room number.

    // plogo.position(windowWidth/2, 50);
    plogo = createImg(
      "./imgs/logo02.png",
      "퍼레이드진진진 로고",
      "",
      function(im) {
        im.show();
        im.size(windowWidth, AUTO);
      }
    );
    intro = createP(
      "흘러가는 진 퍼레이드에 오신거 환영합니다. <br>*본인의 기기로 보고 싶은 퍼레이드의 구간을 고르세요. <br>여러 개의 기기로 퍼레이드를 연결해서 볼 수 있습니다.<br>*이 퍼레이드에서 흘러가는 진들은 각자의 이야기를 가지고 있습니다. <br>대체텍스트가 포함되어 있어 스크린리더를 통해 이야기를 음성으로 들을 수 있습니다."
    );
    intro.style("font-size", windowHeight / 30 + "pt");
    intro.class("intro");
    var roomsel = createDiv();
    roomsel.class("roomsel");
    for (var idx = 9; idx > 0; idx--) {
      var b = createButton(str(idx), str(idx));
      b.mouseClicked(function() {
        silence.play();
        myroom = parseInt(this.value());

        socket.emit("room", myroom, function(res) {
          if (res) {
            console.log("entered the room -> " + myroom);
            createP(str(myroom));
            setTimeout(function() {
              ready = createP("퍼레이드 시작합니다!!");
              ready.position(
                windowWidth / 2 - windowWidth/10,
                windowHeight / 2
              );
            }, 500);
          } else {
            console.log("rejected!");
          }
        });

        setTimeout(function() {
          selectAll(".roomsel").forEach(function(item) {
            item.remove();
          });
          selectAll(".intro").forEach(function(item) {
            item.remove();
          });
          plogo.remove();
        }, 1000);
        setTimeout(function() {
          ready.remove();
        }, 8000);
      });
      roomsel.child(b);
    }
  } else {
    //re-connection -> just connect to remembered room!
    socket.emit("room", myroom, function(res) {
      if (res) {
        console.log("entered the room -> " + myroom);
      } else {
        console.log("rejected!");
      }
    });
  }
});

socket.on("post", function(post) {
  console.log(post);
  var object = post.object;

  var img = createImg(object.src, object.alt, "", function(im) {
    im.show();
    im.size(
      (windowHeight * (object.size.base + object.size.random * Math.random())) /
        100,
      AUTO
    );
    im.position(
      windowWidth,
      (windowHeight * (object.y.base + object.y.random * Math.random())) / 100
    );
    im.attribute("data-type", object.type);
    im.attribute("data-showtime", object.showtime / 1000); //milli-sec. -> seconds.

    //
    if (object.type == "icon") {
      im.class("rotate");
      im.style("animation-duration", object.rotate + "s");
      var orgs = im.style("transform-origin").split(" ");
      var str = parseFloat(orgs[0]) + object.pivot.x + "px";
      str = str + " " + parseFloat(orgs[1]) + object.pivot.y + "px";
      im.style("transform-origin", str);
    }
  });
  img.hide();
  arr.push(img);
});

function draw() {
  arr.forEach(function(img) {
    var showtime = parseFloat(img.attribute("data-showtime"));
    var type = img.attribute("data-type");
    var x = img.position().x;
    var y = img.position().y;
    y = y + random(-1, 1);
    x = x - windowWidth / (fr * showtime);

    //
    if (type == "icon") {
      img.style("z-index", "-1");
    }
    3;

    img.position(x, y);

    if (x < -windowHeight*0.9) {
      img.remove();
    }
  });
}

function randomvoiceplay() {
  (looper = function(timeout) {
    setTimeout(function() {
      voice[int(random(19))].play();
      looper(random(8000, 12000));
    }, timeout);
  })(8000);
}
