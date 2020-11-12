var http = require("http");
var express = require("express");
var app = express();
// *--- force https ---*
//from : https://glitch.com/edit/#!/force-http-or-https?path=server.js
// app.set('trust proxy', true); // <- required
// app.use((req, res, next) => {
//   if(!req.secure) return res.redirect('https://' + req.get('host') + req.url);
//   next();
// });
//^--- but, this doesn't work :( for us.
// maybe... 'flyio' is interfering the middle (http://pzzz.ink <- flyio -> https://dianaband-paradezzz.glitch.me)
// ==> so, we won't do it. but we will let the client do it. -> public/sketch.js #7 ~ #11
var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port);
//
app.use(express.static("public"));
var io = require("socket.io")(server, { 
  pingInterval: 1000,
  pingTimeout: 3000  
});   
 
//
var score = require("./public/score.json");

//
//there will be 16 rooms called: "room0", "room1", ... , "room15"
//if any other room is requested.. well, we will simply reject.
var roommax = 16;

//
io.on("connection", function(socket) {
  console.log("someone connected.");
  socket.on("disconnect", function() { console.log("someone disconnected."); });
  
  socket.on("room", function(room, fn) {
    // parseInt(room)
    if (room >= 0 && room < roommax) {
      socket.join("room" + room);
      fn(true);
    } else {
      fn(false);
    }
  });
});   

//
var pointer = 0; // pointer : 0 ~ (length-1)
var looper;
(looper = function(timeout) { 
  setTimeout(function() {
    
    //pointer = 20;
    // console.log(score[pointer]);
 
    //
    for (var index = 0; index < roommax; index++) {
      
      // NOTE: 'pointer' must be 'remembered' since 'pointer' will increase almost immediately! pass as argument => 'pointed'
      // NOTE: 'index' is same => 'indexed'
      setTimeout(function(pointed, indexed) {
        
        io.to("room" + indexed).emit("post", score[pointed]);
        
      }, score[pointer].object.showtime * index, pointer, index);
    }

    var timegap = score[pointer].timegap.base + Math.random()*score[pointer].timegap.random;
    // console.log(timegap);
    
    pointer++;    
    if (pointer >= score.length) pointer = 0;
    
    looper(timegap);
  }, timeout);
})(1000);