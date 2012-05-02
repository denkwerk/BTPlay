var fs = require('fs');
var url = require('url');
var zlib = require('zlib');
var querystring = require('querystring');
var prod = false;

// would usually use connect or express
var app = require('http').createServer(function(request, response) {
  request.content = '';
  request.addListener('data', function(data) {
      request.content += data;
  });
   request.addListener('end', function() {

      var path = url.parse(request.url).pathname;
      if (path == "/") {
        path = "index.html";
      }

      // only okay for this development setup
        var filePath = './' + path;
        var acceptEncoding = request.headers['accept-encoding'];

        fs.readFile(filePath, function(error, content) {
          switch (path.substr(path.lastIndexOf('.') + 1)) {
            case 'css':
              response.setHeader("Content-Type", "text/css");
                  raw = fs.createReadStream(filePath);
                  if (acceptEncoding.match(/\bdeflate\b/)) {
                    response.writeHead(200, { 'content-encoding': 'deflate' });
                    raw.pipe(zlib.createDeflate()).pipe(response);
                  } else if (acceptEncoding.match(/\bgzip\b/)) {
                    response.writeHead(200, { 'content-encoding': 'gzip' });
                    raw.pipe(zlib.createGzip()).pipe(response);
                  } else {
                    response.end(content);
                  }
              break;
            case 'html':
            case 'htm':
              response.setHeader("Content-Type", "text/html");
              response.end(content);
              break;
            case 'js':
              response.setHeader("Content-Type", "text/javascript");
                  raw = fs.createReadStream(filePath);
                  if (acceptEncoding.match(/\bdeflate\b/)) {
                    response.writeHead(200, { 'content-encoding': 'deflate' });
                    raw.pipe(zlib.createDeflate()).pipe(response);
                  } else if (acceptEncoding.match(/\bgzip\b/)) {
                    response.writeHead(200, { 'content-encoding': 'gzip' });
                    raw.pipe(zlib.createGzip()).pipe(response);
                  } else {
                    response.end(content);
                  }
              break;
            case 'ico':
              response.setHeader("Content-Type", "image/x-icon");
              response.end(content);
              break;
            case 'wav':
              response.setHeader("Content-Type", "audio/x-wav");
              response.setHeader("Content-Length", content.length);
              response.end(content);
              break;
            case 'png':
              response.setHeader("Content-Type", "image/png");
              response.end(content);
              break;
            default:
              response.end(content);
          }
        });
    });   
});

var io = require('socket.io').listen(app);

app.listen(8089);
console.log('I will impress you @port 8089');

io.sockets.on('connection', function (socket) {
  console.log('connected');

  socket.on('prev', function (msg) {
    io.sockets.emit('prev');
  });

  socket.on('next', function (msg) {
    io.sockets.emit('next');
  });

  socket.on('playCoin', function (msg) {
    io.sockets.emit('playCoin');
  });

  socket.on('playGameover', function (msg) {
    io.sockets.emit('playGameover');
  });

  socket.on('playJump', function (msg) {
    io.sockets.emit('playJump');
  });

  socket.on('playBowser', function (msg) {
    io.sockets.emit('playBowser');
  });

  socket.on('playPipe', function (msg) {
    io.sockets.emit('playPipe');
  });

  socket.on('playFlag', function (msg) {
    io.sockets.emit('playFlag');
  });

  socket.on('playDie', function (msg) {
    io.sockets.emit('playDie');
  });

  socket.on('playTime', function (msg) {
    io.sockets.emit('playTime');
  });

  socket.on('disconnect', function () {
    console.log('disconnect');
  });
});