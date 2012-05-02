var fs = require('fs');
var url = require('url');
var zlib = require('zlib');
var querystring = require('querystring');

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
      if (request.method !== 'POST') {
        console.log('Requested: ' + path);
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
        		case 'png':
        		  response.setHeader("Content-Type", "image/png");
              response.end(content);
        			break;
            default:
              response.setHeader("Content-Type", "application/json");

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
        	}
        });
    });   
});
app.listen(8001);
console.log('GETUSERMEDIA SAMPLE: listen 8001');