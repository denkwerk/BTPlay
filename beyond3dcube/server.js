var fs = require('fs');
var url = require('url');
var port = 8009;

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
              response.setHeader("Content-Type", "text/css");
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

app.listen(port);
console.log('BEYOND3DCUBE SAMPLE: listen ' + port);