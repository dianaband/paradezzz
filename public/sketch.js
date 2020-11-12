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

var socket = io("https://dianaband-paradezzz.glitch.me/");
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
  silence = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F_silence.wav?v=1605079435755"
  );
}

function setup() {
  noCanvas();
  frameRate(fr);
  voice[0] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F018.mp3?v=1605065703249"
  );
  voice[1] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F011.mp3?v=1605065704890"
  );
  voice[2] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F14.mp3?v=1605065705431"
  );
  voice[3] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F012.mp3?v=1605065705852"
  );
  voice[4] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F17.mp3?v=1605065706201"
  );
  voice[5] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F11.mp3?v=1605065707520"
  );
  voice[6] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F013.mp3?v=1605065707851"
  );
  voice[7] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F022.mp3?v=1605065708590"
  );
  voice[8] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F020.mp3?v=1605065708800"
  );
  voice[9] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F021.mp3?v=1605065709256"
  );
  voice[10] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F014.mp3?v=1605065709488"
  );
  voice[11] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F16.mp3?v=1605065710421"
  );
  voice[12] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F015.mp3?v=1605065710641"
  );
  voice[13] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F18.mp3?v=1605065710830"
  );
  voice[14] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F12.mp3?v=1605065711069"
  );
  voice[15] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F019.mp3?v=1605065711343"
  );
  voice[16] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F13.mp3?v=1605065711531"
  );
  voice[17] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F016.mp3?v=1605065712590"
  );
   voice[18] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F017.mp3?v=1605065712783"
  ); 
  voice[19] = loadSound(
    "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2F023.mp3?v=1605065713039"
  );
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
      "https://cdn.glitch.com/b121cdbd-e958-4ffd-99dd-76922c2c225b%2Flogo02.png?v=1604966478405",
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
