const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = req.url === '/' ? '/html/login.html' : req.url;

    // path e.ks. '/post', then 'post.html'
    if (filePath === '/post') {
        filePath = '/html/post.html';
    } else if (filePath === '/groups') {
        filePath = '/html/groups.html';
    } else if (filePath === '/calendar') {
        filePath = '/html/calendar.html';
    } else if (filePath === '/signup') {
        filePath = '/html/signup.html';
    } else if (filePath === '/coffeebreak') {
        filePath = '/html/coffeebreak.html';
    } else if (filePath === '/invitation') {
        filePath = '/html/invitation.html';
    } else if (filePath === '/create') {
        filePath = '/html/create.html';
    } else if (filePath === '/login') {
        filePath = '/html/login.html';
    }

    filePath = path.join(__dirname, '../PublicResources', filePath);

    fs.readFile(filePath, (error, data) => {
        if (error) {
        if (error.code === 'ENOENT') {
            res.writeHead(404);
            res.end('Error: File not found');
        } else {
            res.writeHead(500);
            res.end('Error: Internal Server Error');
        }
        } else {
        // which content type
        let contentType = 'text/plain';
        const ext = path.extname(filePath);
        if (ext === '.html') {
            contentType = 'text/html';
        } else if (ext === '.css') {
            contentType = 'text/css';
        } else if (ext === '.js') {
            contentType = 'text/javascript';
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
        }
    }); // end readFile
}); // end create Server

const PORT = process.env.PORT || 3240;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); // end port
