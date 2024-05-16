const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/login') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString(); // Buffer to string
        });
        req.on('end', () => {
            // Parse the JSON data
            const loginData = JSON.parse(body);
            const username = loginData.username;
            const password = loginData.password;

            // Check if the username exists in the users.json file
            fs.readFile(path.join(__dirname, '../PublicResources', 'users.json'), 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error: Could not read user data');
                } else {
                    const users = JSON.parse(data);
                    const user = users.find(user => user.username === username);
                    if (user) {
                        // Username exists, now check if the password matches
                        if (user.password === password) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Login successful' }));
                        } else {
                            res.writeHead(401);
                            res.end('Invalid password');
                        }
                    } else {
                        res.writeHead(404);
                        res.end('User not found');
                    }
                }
            });
        });
    } else if (req.method === 'POST' && req.url === '/signup') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString(); // Buffer to string
        });
        req.on('end', () => {
            // Parse the JSON data
            const userData = JSON.parse(body);

            // Save the new user data to the users.json file
            addNewUserToDatabase(userData, (err) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error: Could not save the user');
                } else {
                    res.writeHead(200);
                    res.end('User signed up successfully');
                }
            });
        });
    } else if (req.method === 'POST' && req.url === '/post') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString(); // Buffer to string
        });
        req.on('end', () => {
            // Parse the json data
            const postData = JSON.parse(body);
            postData.id = Date.now(); // Assign a unique ID to the post
            postData.likes = postData.likes || 0;
            postData.dislikes = postData.dislikes || 0;
            postData.comments = []; // Initialize comments array

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
    } else if (req.method === 'POST' && req.url.startsWith('/posts/')) {
        const urlParts = req.url.split('/');
        const postId = parseInt(urlParts[2]);
        const action = urlParts[3];

        if (action === 'like' || action === 'dislike') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {
                updatePostLikesOrDislikes(postId, action, (err) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error: Could not update post likes/dislikes');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Post updated successfully' }));
                    }
                });
            });
        } else if (action === 'comment') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const commentData = JSON.parse(body);
                addCommentToPost(postId, commentData, (err) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error: Could not add comment');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Comment added successfully' }));
                    }
                });
            });
        } else {
            res.writeHead(404);
            res.end('Error: Invalid action');
        }
    } else if (req.method === 'POST' && req.url === '/update-user-data') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString(); // Buffer to string
        });
        req.on('end', () => {
            // Parse the json data
            const userData = JSON.parse(body);

            // Update or remove the invitation based on the action
            if (userData.action === 'accept') {
                appendUsersToDatabase(userData, (err) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error: Could not accept the invitation');
                    } else {
                        res.writeHead(200);
                        res.end('Invitation accepted successfully');
                    }
                });
            } else if (userData.action === 'decline') {
                removeInvitationFromUser(userData, (err) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error: Could not decline the invitation');
                    } else {
                        res.writeHead(200);
                        res.end('Invitation declined successfully');
                    }
                });
            }
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
        } else if (filePath === '/teamcohesion') {
            filePath = '/html/teamcohesion.html';
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

        postData.likes = postData.likes || 0;
        postData.dislikes = postData.dislikes || 0;
        postData.comments = postData.comments || [];

        posts.push(postData);
        fs.writeFile(databasePath, JSON.stringify(posts, null, 2), callback);
    });
}

function updatePostLikesOrDislikes(postId, action, callback) {
    const databasePath = path.join(__dirname, '../PublicResources', 'posts.json');

    fs.readFile(databasePath, 'utf8', (err, data) => {
        if (err) {
            return callback(err);
        }

        const posts = JSON.parse(data);
        const post = posts.find(post => post.id === postId);

        if (post) {
            if (action === 'like') {
                post.likes = (post.likes || 0) + 1;
                console.log(`Post ID ${postId} liked. New likes: ${post.likes}`);
            } else if (action === 'dislike') {
                post.dislikes = (post.dislikes || 0) + 1;
                console.log(`Post ID ${postId} disliked. New dislikes: ${post.dislikes}`);
            }

            fs.writeFile(databasePath, JSON.stringify(posts, null, 2), (writeErr) => {
                if (writeErr) {
                    console.log('Error writing file:', writeErr);
                    return callback(writeErr);
                }
                console.log('File successfully written');
                callback(null);
            });
        } else {
            console.log('Post not found:', postId);
            callback(new Error('Post not found'));
        }
    });
}

function addCommentToPost(postId, commentData, callback) {
    const databasePath = path.join(__dirname, '../PublicResources', 'posts.json');

    fs.readFile(databasePath, 'utf8', (err, data) => {
        if (err) {
            return callback(err);
        }

        const posts = JSON.parse(data);
        const post = posts.find(post => post.id === postId);

        if (post) {
            post.comments.push(commentData);

            fs.writeFile(databasePath, JSON.stringify(posts, null, 2), (writeErr) => {
                if (writeErr) {
                    console.log('Error writing file:', writeErr);
                    return callback(writeErr);
                }
                console.log('Comment successfully added');
                callback(null);
            });
        } else {
            console.log('Post not found:', postId);
            callback(new Error('Post not found'));
        }
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

        // Parse existing users
        let users = JSON.parse(data);

        // Find the index of the user to be updated
        const index = users.findIndex(user => user.username === usersData.username);

        if (index !== -1) {
            // Remove the accepted invitation from invitations array
            users[index].invitations = users[index].invitations.filter(invitation => invitation !== usersData.invitation);
            // Add the accepted invitation to the groups array
            users[index].group.push(usersData.invitation);
        } else {
            console.error('User not found:', usersData.username);
        }

        // Write the updated user data back to the file
        fs.writeFile(databasePath, JSON.stringify(users, null, 2), callback);
    });
}

function removeInvitationFromUser(userData, callback) {
    const databasePath = path.join(__dirname, '../PublicResources', 'users.json');

    fs.readFile(databasePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                data = '[]';
            } else {
                return callback(err);
            }
        }

        // Parse existing users
        let users = JSON.parse(data);

        // Find the index of the user to be updated
        const index = users.findIndex(user => user.username === userData.username);

        if (index !== -1) {
            // Remove the declined invitation from the invitations array
            users[index].invitations = users[index].invitations.filter(invitation => invitation !== userData.invitation);
        } else {
            console.error('User not found:', userData.username);
        }

        // Write the updated user data back to the file
        fs.writeFile(databasePath, JSON.stringify(users, null, 2), callback);
    });
}

function addNewUserToDatabase (userData, callback) {
    const databasePath = path.join(__dirname, '../PublicResources', 'users.json');

    fs.readFile(databasePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                data = '[]';
            } else {
                return callback(err);
            }
        }

        // Parse existing users
        let users = JSON.parse(data);

        // Check if the username already exists
        const existingUser = users.find(user => user.username === userData.username);
        if (existingUser) {
            return callback(new Error('Username already exists'));
        }

        userData.group = userData.group || [];
        userData.invitations = userData.invitations || [];
        
        // Add the new user to the users array
        users.push(userData);

        // Write the updated user data back to the file
        fs.writeFile(databasePath, JSON.stringify(users, null, 2), callback);
    });
}

const PORT = process.env.PORT || 3240;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
