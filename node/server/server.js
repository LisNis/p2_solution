const http = require('http');
const fs = require('fs');
const path = require('path');


const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/post') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString(); // Buffer to string
        });
        req.on('end', () => {
            // Parse the json data
            const postData = JSON.parse(body);


            // Append the post to json
            appendPostToDatabase(postData, (err) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error: Could not save the post');
                } else {
                    res.writeHead(200);
                    res.end('Post saved successfully');
                }
            });
        });
    } else if (req.method === 'GET' && req.url === '/posts') {
        // get requests
        fs.readFile(path.join(__dirname, '../PublicResources', 'posts.json'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error: Could not fetch posts');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
    } else if (req.method === 'POST' && req.url === '/invitation') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString(); // Buffer to string
        });
        req.on('end', () => {
            // Parse the json data
            const usersData = JSON.parse(body);


            // Append the user data to json
            appendUsersToDatabase(usersData, (err) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error: Could not save the users update');
                } else {
                    res.writeHead(200);
                    res.end('Users.json update saved successfully');
                }
            });
        });
    } else if (req.method === 'GET' && req.url === '/users') {
        // get requests
        fs.readFile(path.join(__dirname, '../PublicResources', 'users.json'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error: Could not fetch users');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
    } else {
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
                // Determine content type
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
    }
}); // end create Server


function appendPostToDatabase(postData, callback) {
    const databasePath = path.join(__dirname, '../PublicResources', 'posts.json');


    fs.readFile(databasePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                data = '[]';
            } else {
                return callback(err);
            }
        }


        // Parse existing posts
        const posts = JSON.parse(data);
        posts.push(postData);
        fs.writeFile(databasePath, JSON.stringify(posts, null, 2), callback);
    });
}


function appendUsersToDatabase(usersData, callback) {
    const databasePath = path.join(__dirname, '../PublicResources', 'users.json');


    fs.readFile(databasePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                data = '[]';
            } else {
                return callback(err);
            }
        }


        // Parse existing posts
        const users = JSON.parse(data);
        users.push(usersData);
        fs.writeFile(databasePath, JSON.stringify(users, null, 2), callback);
    });
}


const PORT = process.env.PORT || 3240;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); // end port