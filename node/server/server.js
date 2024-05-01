const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3240;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  fs.readFile('./PublicResources/html/login.html', function(error, data) {
    if (error) {
        res.writeHead(404);
        res.write('Error: File not found');
    } else {
        res.write(data)
    }
    res.end();
  })
});

server.listen(port, hostname, (error) => {
    if (error) {
        console.log('Something went wrong', error);
    } else {
        console.log(`Server running at http://${hostname}:${port}/`);
    }
});