const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../PublicResources', 'users.json');

function handleSignup(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Buffer to string
    });
    req.on('end', () => {
        const userData = JSON.parse(body);
        const username = userData.username;
        const password = userData.password;

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                res.writeHead(500);
                res.end('Error: Could not hash the password');
                return;
            }

            // Save the new user
            const newUser = {
                username: username,
                password: hashedPassword,
                group: [],
                invitations: []
            };

            addNewUserToDatabase(newUser, err => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error: Could not save the user');
                } else {
                    res.writeHead(200);
                    res.end('User signed up successfully');
                }
            });
        });
    });
}

function handleLogin(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Buffer to string
    });
    req.on('end', () => {
        const loginData = JSON.parse(body);
        const username = loginData.username;
        const password = loginData.password;

        fs.readFile(usersFilePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error: Could not read user data');
                return;
            }

            try {
                const users = JSON.parse(data);
                const user = users.find(user => user.username === username);
                if (user) {
                    // Compare the hashed password
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (result) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Login successful' }));
                        } else {
                            res.writeHead(401);
                            res.end('Invalid password');
                        }
                    });
                } else {
                    res.writeHead(404);
                    res.end('User not found');
                }
            } catch (parseError) {
                res.writeHead(500);
                res.end('Error: Could not parse user data');
            }
        });
    });
}

module.exports = {
    handleSignup,
    handleLogin
};
