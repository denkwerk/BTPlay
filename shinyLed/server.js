// load the duino lib
var arduino = require('duino');
var fs = require('fs');
var url = require('url');
var io = require('socket.io').listen(8014);

// set up websockets
io.sockets.on('connection', function (socket) {
  // change the led state & emit if a toggle cmd. comes in
  socket.on('toggleLed', function (data) {
     io.sockets.emit('ledChange', data);
     changeLedState(data);    
  });
});

// init the arduino board
var board = new arduino.Board({
  debug: true
});

// set green led pins
var redLedPins = [11, 5, 9];
// set red led pins
var greenLedPins = [6, 10, 12];

// led state & object maps
var states = {};
var greenLeds = [];
var redLeds    = [];

// generate green led objects
for (idx in greenLedPins) {
  greenLeds.push(new arduino.Led({
    board: board,
    pin: greenLedPins[idx]
  }));
  states['green' + idx] = false; 
}

// generate red led objects
for (idx in redLedPins) {
  redLeds.push(new arduino.Led({
    board: board,
    pin: redLedPins[idx]
  }));
  states['red' + idx] = false; 
}


// change the state of an led, send data for all
function changeLedState (data) {
  states[data.color + data.idx] = !states[data.color + data.idx];
  
  for (idx in redLedPins) {
    if (states['red' + idx] === true) { redLeds[idx].on() }else{ redLeds[idx].off() }
  }

  for (idx in greenLedPins) {
    if (states['green' + idx] === true) { greenLeds[idx].on() }else{ greenLeds[idx].off() }
  }
}

// setup the board connection when ready
board.on('ready', function(){});

// would usually use connect or express
var app = require('http').createServer(function(request, response) {
   request.addListener('end', function() {
      var path = url.parse(request.url).pathname;
      if (path == "/") {
        path = "index.html";
      }

      // only okay for this development setup
        var filePath = './' + path;
        fs.readFile(filePath, function(error, content) {
          switch (path.substr(path.lastIndexOf('.') + 1)) {
            case 'css':
              response.end(content);
              break;
            case 'html':
            case 'htm':
              response.setHeader("Content-Type", "text/html");
              response.end(content);
              break;
            case 'js':
              response.setHeader("Content-Type", "text/javascript");
              response.end(content);
              break;
            case 'ico':
              response.setHeader("Content-Type", "image/x-icon");
              response.end(content);
              break;      
            case 'png':
              response.setHeader("Content-Type", "image/png");
              response.end(content);
              break;
            }
        });   
    });
});

// start the app server
app.listen(8004);
console.log('ARDUINO SHINYLED SAMPLE: listen 8004');
