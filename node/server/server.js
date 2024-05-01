const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3240;

const publicResourcesPath = "../PublicResources";

// Function to read all files recursively
function readFilesRecursively(dirPath) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            readFilesRecursively(filePath); // Recursion for subdirectories
        } else {
            console.log("File:", filePath);
            // Here you can perform operations with the file if needed
        }
    });
}

readFilesRecursively(publicResourcesPath);

const server = http.createServer((req, res) => {
<<<<<<< HEAD
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  fs.readFile('../PublicResources/html/login.html', function(error, data) {
    if (error) {
        res.writeHead(404);
        res.write('Error: File not found');
    } else {
        res.write(data)
    }
    res.end();
  })
=======
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    fs.readFile('../PublicResources/html/login.html', function(error, data) {
        if (error) {
            res.writeHead(404);
            res.write('Error: File not found');
        } else {
            res.write(data)
        }
        res.end();
    })
>>>>>>> d71197df1e2832042e3fa915dc31f2bc6c7e76d1
});

server.listen(port, hostname, (error) => {
    if (error) {
        console.log('Something went wrong', error);
    } else {
        console.log(`Server running at http://${hostname}:${port}/`);
    }
});
