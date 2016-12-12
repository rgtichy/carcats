// get the http module:
var http = require('http');
// fs module allows us to read and write content for responses!!
var fs = require('fs');
var pathFileName = require("filename-regex");

//
//  Event Handlers
//
// creating a server using http module:
var server = http.createServer(function (request, response){
  function myReadFile(filename, status, encoding, type){
    contents="";
    if (filename !== ""){
      fs.readFile(filename, encoding, function (errors, contents){
        response.writeHead(status, {'Content-Type': type});
        response.write(contents);  //  send response body
        response.end(); // finished!
        });
    }
    else {
      response.writeHead(status, {'Content-Type': type});
      response.write("Page Not Found.");  //  send response body
      response.end();
    }
  }
  function writeResp(fileExt, requestName){
    var fileExt;
    switch (fileExt) {
      case '.html':
      case '.htm':
        var filename = './views' + requestName;
        myReadFile(filename, 200, 'utf-8', 'text/html');
        break;
      case '.css':
        var filename = './stylesheets' + requestName;
        myReadFile(filename, 200, 'utf-8', 'text/css');
        break;
      case '.js':
        var filename = './javascript' + requestName;
        myReadFile(filename, 200, 'utf-8', 'text/javascript');
        break;
      case '.jpg':
      case '.gif':
      case '.jpeg':
      case '.png':
        var filename = './images' + requestName;
        myReadFile(filename, 200, '', 'image/*');
        break;
      default:
        myReadFile("", 404, 'utf-8', 'text/html');
        // response.writeHead(404, {'Content-Type': 'text/html'});
        // response.write('');
        // response.end();
    }

  }
    // see what URL the clients are requesting:
    // console.log('~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~')
    // console.log('client request URL: ', request.url);
    // console.log(request);
    // console.log('~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~')
    // this is how we do routing:
    if(request.url === '/') {
        fs.readFile('index.html', 'utf8', function (errors, contents){
            response.writeHead(200, {'Content-Type': 'text/html'});  // send data about response
            response.write(contents);  //  send response body
            response.end(); // finished!
        });
    }
    else{
      var pFN = request.url.match(pathFileName());
      console.log(pFN)
      if (pFN == null || pFN[0].indexOf('.') == -1){
        // no filename present, so
        // we're looking for a route instead of a file to serve
        console.log("parse for route not file")
        switch (pFN[0]) {
          case 'cars':
          case 'cars/':
            writeResp('.html', '/cars.html', response);
            break;
          case 'cats':
          case 'cats/':
            writeResp('.html', '/cats.html', response);
            break;
          default:
            myReadFile("", 404, 'utf-8', 'text/html');
        }
      }
      else{
        // remove filename from path
        var path=pFN.input.slice(0,pFN.index);
        console.log(path)
        var fileExt = /\..*/.exec(pFN[0])
        console.log(fileExt,pFN.input)
        writeResp(fileExt[0], pFN.input, response);
      }
    }
});
// tell your server which port to run on
server.listen(7077);
// print to terminal window
console.log("Running in localhost at port 7077");
