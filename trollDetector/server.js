// load the duino lib
var arduino = require('duino');
var fs = require('fs');
var url = require('url');
var twitter = require('ntwitter');
var io = require('socket.io').listen(8015);
var _ = require('underscore');
var alreadySend = {};

var user = '';
var conference = '';

// init the arduino board
var board = new arduino.Board({
  debug: true
});

// set green led pins
var redLedPins = [11, 5, 9];
// set red led pins
var greenLedPins = [6, 10, 12];

// led state map
var states = {};

// led object maps
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

function resetLedState (data) {
  for (idx in redLedPins) { redLeds[idx].off(); }
  for (idx in greenLedPins) { greenLeds[idx].off();}
}

function changeLedState (data) {
  
  for (idx in redLedPins) {
    var id = (parseInt(idx, 10) + 1);
    console.log('red' + id);
    if (states['red' + id] === true) { redLeds[idx].on() }else{ redLeds[idx].off() }
  }

  for (idx in greenLedPins) {
    var id = (parseInt(idx, 10) + 1);
    console.log('green' + id);
    if (states['green' + id] === true) { greenLeds[idx].on() }else{ greenLeds[idx].off() }
  }

  setTimeout(resetLedState, 5000);
}

var twit = new twitter({
  consumer_key: 'wk9vdGH1G2nQG7NCHyGWag',
  consumer_secret: 'AIamM962lomQS3iHfy4JYb4WvviwUE4p3f74EU3gck',
  access_token_key: '303823728-gcoKcm5hQJlXpKfvXNll9yUwJEYcVkml3izVmZnP',
  access_token_secret: 'MlIMv6WIcYthsVCZffWpuBr9OysHl65BJUw5vYH3Q'
});

setInterval(function () {
  var iterationSend = false;
  console.log('asking twitter');
  twit.search('#btplay AND @asciidisco', {}, function(err, data) {
    _.each(data.results, function (tweet) {
      
      // troll stage 1
      if (tweet.text.search('#trollish') !== -1 && iterationSend === false && alreadySend[tweet.id] !== true) {
        io.sockets.emit('troll', {tweet: tweet, strength: 1});
        alreadySend[tweet.id] = true;
        iterationSend = true;
        states['red1'] = true;
        states['red2'] = false;
        states['red3'] = false;        
        states['green1'] = false;
        states['green2'] = false;
        states['green3'] = false;          
        changeLedState();
      }

      // troll stage 2
      if (tweet.text.search('#icandobetterdude') !== -1 && iterationSend === false && alreadySend[tweet.id] !== true) {
        io.sockets.emit('troll', {tweet: tweet, strength: 2});
        alreadySend[tweet.id] = true;
        iterationSend = true;
        states['red1'] = true;
        states['red2'] = true;
        states['red3'] = false;        
        states['green1'] = false;
        states['green2'] = false;
        states['green3'] = false;         
        changeLedState();
      }

      // troll stage 3
      if (tweet.text.search('#whatswrongwiththatguyonstage') !== -1 && iterationSend === false && alreadySend[tweet.id] !== true) {
        io.sockets.emit('troll', {tweet: tweet, strength: 3});
        alreadySend[tweet.id] = true;
        iterationSend = true;
        states['red1'] = true;
        states['red2'] = true;
        states['red3'] = true;
        states['green1'] = false;
        states['green2'] = false;
        states['green3'] = false;                
        changeLedState();
      }

      // troll stage 1
      if (tweet.text.search('#mothereffingentertainish') !== -1 && iterationSend === false && alreadySend[tweet.id] !== true) {
        io.sockets.emit('awesomness', {tweet: tweet, strength: 1});
        alreadySend[tweet.id] = true;
        iterationSend = true;
        states['green1'] = true;
        states['green2'] = false;
        states['green3'] = false;
        states['red1'] = false;
        states['red2'] = false;
        states['red3'] = false;         
        changeLedState();
      }

      // troll stage 2
      if (tweet.text.search('#awesomchestral') !== -1 && iterationSend === false && alreadySend[tweet.id] !== true) {
        io.sockets.emit('awesomness', {tweet: tweet, strength: 2});
        alreadySend[tweet.id] = true;
        iterationSend = true;
        states['green1'] = true;
        states['green2'] = true;
        states['green3'] = false;
        states['red1'] = false;
        states['red2'] = false;
        states['red3'] = false;          
        changeLedState();
      }

      // troll stage 3
      if (tweet.text.search('#uebertalk') !== -1 && iterationSend === false && alreadySend[tweet.id] !== true) {
        io.sockets.emit('awesomness', {tweet: tweet, strength: 3});
        alreadySend[tweet.id] = true;
        iterationSend = true;
        states['green1'] = true;
        states['green2'] = true;
        states['green3'] = true;
        states['red1'] = false;
        states['red2'] = false;
        states['red3'] = false;             
        changeLedState();
      }

    });
  });
}, 7500);

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
            case 'gif':
              response.setHeader("Content-Type", "image/gif");
              response.end(content);
              break;              
            }
        });   
    });
});

// start the app server
app.listen(8005);
console.log('ARDUINO TROLLDETECTOR SAMPLE: listen 8005');
