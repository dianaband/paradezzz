/*
global loadSound frameRate background createButton io noCanvas 
select createP windowWidth windowHeight random createImg createDiv
AUTO loadJSON createCanvas
*/

var socket = io(location.host);
var n = 0;
var fr = 30;
var arr = [];

var score;
function preload() {
  loadJSON("/score.json", function(json) {
    score = json;
  });
}

function setup() {
  noCanvas();
  frameRate(fr);
}

socket.on('connect', function() {
  socket.emit("room", 0, function(res) {
    if (res) {
      console.log("entered the room.");
    } else {
      console.log("rejected!");
    }
  });
});

socket.on("post", function(post) {
  console.log(post);
  var object = post.object;
  var img = createImg(object.src, "", "", function(im) {
    im.show();
    im.size(windowHeight*(object.size.base + object.size.random*Math.random())/100, AUTO);
    im.position(windowWidth, windowHeight*(object.y.base + object.y.random*Math.random())/100);
    im.attribute("data-type", object.type);
    im.attribute("data-showtime", object.showtime / 1000); //milli-sec. -> seconds.
    //
    if (object.type == 'icon') {
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
    if (type == 'icon') { }

    img.position(x, y);
    if (x < -500) {
      img.remove();
    }
  });
}
