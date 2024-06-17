// Importing required modules
const http = require('http'); // For creating HTTP server
const fs = require('fs'); // For file system operations
const path = require('path'); // For working with file and directory paths
const bcrypt = require('bcrypt'); // For hashing passwords
const url = require('url'); // For URL parsing

// Defining file paths for storing events, posts, and users data
const eventsFilePath = path.join(__dirname, '../PublicResources/data', 'events.json'); // Path to events data
const postsFilePath = path.join(__dirname, '../PublicResources/data', 'posts.json'); // Path to posts data
const usersFilePath = path.join(__dirname, '../PublicResources/data', 'users.json'); // Path to users data

// Creating the HTTP server
const server = http.createServer((req, res) => {
    // Handling signup requests
    if (req.method === 'POST' && req.url === '/signup') { // Check if request is POST and URL is /signup
        let body = ''; // Initialize variable to store request body
        req.on('data', chunk => {
            body += chunk.toString(); // Collecting data chunks
        });
        req.on('end', () => {
            const userData = JSON.parse(body); // Parsing the collected data
            const username = userData.username; // Extracting username
            const password = userData.password; // Extracting password

            // Hashing the password
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) { // Check for hashing error
                    res.writeHead(500); // Respond with 500 Internal Server Error
                    res.end('Error: Could not hash the password'); // Send error message
                    return; // Exit function
                }

                // Creating a new user object
                const newUser = {
                    username: username, // Set username
                    password: hashedPassword, // Set hashed password
                    group: [], // Initialize group as empty array
                    invitations: [] // Initialize invitations as empty array
                };

                // Adding the new user to the database
                addNewUserToDatabase(newUser, err => {
                    if (err) { // Check for error in saving user
                        res.writeHead(500); // Respond with 500 Internal Server Error
                        res.end('Error: Could not save the user'); // Send error message
                    } else {
                        res.writeHead(200); // Respond with 200 OK
                        res.end('User signed up successfully'); // Send success message
                    }
                });
            });
        });
    // Handling username availability check requests
    } else if (req.method === 'GET' && req.url.startsWith('/check-username')) { // Check if request is GET and URL starts with /check-username
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`); // Parse the request URL
        const username = parsedUrl.searchParams.get('username'); // Extract the username from query parameters
    
        if (!username) { // Check if username is not provided
            res.writeHead(400); // Respond with 400 Bad Request
            res.end('Error: Username is required for username availability check'); // Send error message
            return; // Exit function
        }
    
        // Reading the users database
        fs.readFile(usersFilePath, 'utf8', (err, data) => {
            if (err && err.code !== 'ENOENT') { // Check for error in reading file and file not found error
                res.writeHead(500); // Respond with 500 Internal Server Error
                res.end('Error: Could not read user database'); // Send error message
                return; // Exit function
            }
    
            let users;
            try {
                users = data ? JSON.parse(data) : []; // Parse user data or initialize as empty array
            } catch (parseError) { // Check for parsing error
                res.writeHead(500); // Respond with 500 Internal Server Error
                res.end('Error: Could not parse user database'); // Send error message
                return; // Exit function
            }
    
            const existingUser = users.find(user => user.username === username); // Find if username already exists
            const response = {
                available: !existingUser // Set availability status
            };
    
            res.writeHead(200, { 'Content-Type': 'application/json' }); // Respond with 200 OK and JSON content type
            res.end(JSON.stringify(response)); // Send response
        });
    // Handling login requests
    } else if (req.method === 'POST' && req.url === '/login') { // Check if request is POST and URL is /login
        let body = ''; // Initialize variable to store request body
        req.on('data', chunk => {
            body += chunk.toString(); // Collecting data chunks
        });
        req.on('end', () => {
            const loginData = JSON.parse(body); // Parsing the collected data
            const username = loginData.username; // Extracting username
            const password = loginData.password; // Extracting password

            // Reading the users database
            fs.readFile(usersFilePath, 'utf8', (err, data) => {
                if (err) { // Check for error in reading file
                    res.writeHead(500); // Respond with 500 Internal Server Error
                    res.end('Error: Could not read user data'); // Send error message
                    return; // Exit function
                }
                
                try {
                    const users = JSON.parse(data); // Parse user data
                    const user = users.find(user => user.username === username); // Find user by username
                    if (user) { // Check if user exists
                        // Comparing the hashed password
                        bcrypt.compare(password, user.password, (err, result) => {
                            if (result) { // Check if password matches
                                res.writeHead(200, { 'Content-Type': 'application/json' }); // Respond with 200 OK and JSON content type
                                res.end(JSON.stringify({ message: 'Login successful' })); // Send success message
                            } else { // If password does not match
                                res.writeHead(401); // Respond with 401 Unauthorized
                                res.end('Invalid password'); // Send error message
                            }
                        });
                    } else { // If user does not exist
                        res.writeHead(404); // Respond with 404 Not Found
                        res.end('User not found'); // Send error message
                    }
                } catch (parseError) { // Check for parsing error
                    res.writeHead(500); // Respond with 500 Internal Server Error
                    res.end('Error: Could not parse user data'); // Send error message
                }
            });
        });
    // Handling post creation requests
    } else if (req.method === 'POST' && req.url === '/post') { // Check if request is POST and URL is /post
        let body = ''; // Initialize variable to store request body
        req.on('data', (chunk) => {
            body += chunk.toString(); // Collecting data chunks
        });
        req.on('end', () => {
            const postData = JSON.parse(body); // Parsing the collected data
            postData.id = Date.now(); // Set post ID to current timestamp
            postData.likes = postData.likes || 0; // Initialize likes to 0 if not provided
            postData.dislikes = postData.dislikes || 0; // Initialize dislikes to 0 if not provided
            postData.comments = []; // Initialize comments as empty array
            postData.pinned = false; // Initialize pinned status to false

            // Adding the new post to the database
            appendPostToDatabase(postData, (err) => {
                if (err) { // Check for error in saving post
                    res.writeHead(500); // Respond with 500 Internal Server Error
                    res.end('Error: Could not save the post'); // Send error message
                } else {
                    res.writeHead(200); // Respond with 200 OK
                    res.end('Post saved successfully'); // Send success message
                }
            });
        });
    // Handling requests to fetch posts
    } else if (req.method === 'GET' && req.url === '/posts') { // Check if request is GET and URL is /posts
        fs.readFile(postsFilePath, 'utf8', (err, data) => { // Reading posts database
            if (err) { // Check for error in reading file
                res.writeHead(500); // Respond with 500 Internal Server Error
                res.end('Error: Could not fetch posts'); // Send error message
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' }); // Respond with 200 OK and JSON content type
                res.end(data); // Send posts data
            }
        });
    // Handling requests to like/dislike/comment/pin/unpin posts
    } else if (req.method === 'POST' && req.url.startsWith('/posts/')) { // Check if request is POST and URL starts with /posts/
        const urlParts = req.url.split('/'); // Split URL parts
        const postId = parseInt(urlParts[2]); // Extract post ID from URL
        const action = urlParts[3]; // Extract action from URL
    
        if (['like', 'dislike', 'unlike', 'undislike'].includes(action)) { // Check if action is like/dislike/unlike/undislike
            let body = ''; // Initialize variable to store request body
            req.on('data', (chunk) => {
                body += chunk.toString(); // Collecting data chunks
            });
    
            req.on('end', () => {
                const { username } = JSON.parse(body); // Parsing the collected data
                // Update post likes or dislikes in the database
                updatePostLikesOrDislikes(postId, action, username, (err) => {
                    if (err) { // Check for error in updating post
                        res.writeHead(500); // Respond with 500 Internal Server Error
                        res.end('Error: Could not update post likes/dislikes'); // Send error message
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' }); // Respond with 200 OK and JSON content type
                        res.end(JSON.stringify({ message: 'Post updated successfully' })); // Send success message
                    }
                });
            });
        } else if (action === 'comment') { // Check if action is comment
            let body = ''; // Initialize variable to store request body
            req.on('data', (chunk) => {
                body += chunk.toString(); // Collecting data chunks
            });

            req.on('end', () => {
                const commentData = JSON.parse(body); // Parsing the collected data
                // Add comment to post in the database
                addCommentToPost(postId, commentData, (err) => {
                    if (err) { // Check for error in adding comment
                        res.writeHead(500); // Respond with 500 Internal Server Error
                        res.end('Error: Could not add comment'); // Send error message
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' }); // Respond with 200 OK and JSON content type
                        res.end(JSON.stringify({ message: 'Comment added successfully' })); // Send success message
                    }
                });
            });
        } else if (action === 'pin') { // Check if action is pin
            let body = ''; // Initialize variable to store request body
            req.on('data', (chunk) => {
                body += chunk.toString(); // Collecting data chunks
            });

            req.on('end', () => {
                // Pin post in the database
                pinPost(postId, (err) => {
                    if (err) { // Check for error in pinning post
                        res.writeHead(500); // Respond with 500 Internal Server Error
                        res.end('Error: Could not pin post'); // Send error message
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' }); // Respond with 200 OK and JSON content type
                        res.end(JSON.stringify({ message: 'Post pinned successfully' })); // Send success message
                    }
                });
            });
        } else if (action === 'unpin') { // Check if action is unpin
            let body = ''; // Initialize variable to store request body
            req.on('data', (chunk) => {
                body += chunk.toString(); // Collecting data chunks
            });

            req.on('end', () => {
                // Unpin post in the database
                unpinPost(postId, (err) => {
                    if (err) { // Check for error in unpinning post
                        res.writeHead(500); // Respond with 500 Internal Server Error
                        res.end('Error: Could not unpin post'); // Send error message
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' }); // Respond with 200 OK and JSON content type
                        res.end(JSON.stringify({ message: 'Post unpinned successfully' })); // Send success message
                    }
                });
            });
        } else {
            res.writeHead(404); // Respond with 404 Not Found
            res.end('Error: Invalid action'); // Send error message
        }
    // Handling requests to delete posts
    } else if (req.url.startsWith('/posts/') && req.method === 'DELETE') { // Check if request is DELETE and URL starts with /posts/
        const postId = decodeURIComponent(req.url.split('/posts/')[1]); // Extract post ID from URL
        let body = ''; // Initialize variable to store request body

        req.on('data', chunk => {
            body += chunk.toString(); // Collecting data chunks
        });

        req.on('end', () => {
            try {
                const postToDelete = JSON.parse(body); // Parsing the collected data

                // Reading posts database
                fs.readFile(postsFilePath, 'utf8', (error, data) => {
                    if (error) { // Check for error in reading file
                        res.writeHead(500, { 'Content-Type': 'text/plain' }); // Respond with 500 Internal Server Error and text/plain content type
                        res.end('Error: Could not read posts file'); // Send error message
                        console.error('Error reading posts file:', error); // Log error
                        return; // Exit function
                    }

                    let posts = JSON.parse(data); // Parse posts data
                    const initialLength = posts.length; // Store initial length of posts array
                    posts = posts.filter(post => post.id !== parseInt(postId)); // Remove post with matching ID

                    if (posts.length === initialLength) { // Check if no post was removed
                        res.writeHead(404, { 'Content-Type': 'text/plain' }); // Respond with 404 Not Found and text/plain content type
                        res.end('Error: Post not found'); // Send error message
                        console.error('Post not found with ID:', postId); // Log error
                        return; // Exit function
                    }

                    // Writing updated posts data to file
                    fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), 'utf8', (error) => {
                        if (error) { // Check for error in writing file
                            res.writeHead(500, { 'Content-Type': 'text/plain' }); // Respond with 500 Internal Server Error and text/plain content type
                            res.end('Error: Could not write to posts file'); // Send error message
                            console.error('Error writing to posts file:', error); // Log error
                            return; // Exit function
                        }

                        res.writeHead(200, { 'Content-Type': 'text/plain' }); // Respond with 200 OK and text/plain content type
                        res.end('Post deleted successfully'); // Send success message
                    });
                });
            } catch (error) { // Catch JSON parsing error
                res.writeHead(400, { 'Content-Type': 'text/plain' }); // Respond with 400 Bad Request and text/plain content type
                res.end('Error: Invalid JSON'); // Send error message
                console.error('Invalid JSON:', error); // Log error
            }
        });
    // Handling requests to update user data for invitations
    } else if (req.method === 'POST' && req.url === '/update-user-data') { // Check if request is POST and URL is /update-user-data
        let body = ''; // Initialize variable to store request body
        req.on('data', (chunk) => {
            body += chunk.toString(); // Collecting data chunks
        });
        req.on('end', () => {
            const userData = JSON.parse(body); // Parsing the collected data

            if (userData.action === 'accept') { // Check if action is accept
                appendUsersToDatabase(userData, (err) => {
                    if (err) { // Check for error in accepting invitation
                        res.writeHead(500); // Respond with 500 Internal Server Error
                        res.end('Error: Could not accept the invitation'); // Send error message
                    } else {
                        res.writeHead(200); // Respond with 200 OK
                        res.end('Invitation accepted successfully'); // Send success message
                    }
                });
            } else if (userData.action === 'decline') { // Check if action is decline
                removeInvitationFromUser(userData, (err) => {
                    if (err) { // Check for error in declining invitation
                        res.writeHead(500); // Respond with 500 Internal Server Error
                        res.end('Error: Could not decline the invitation'); // Send error message
                    } else {
                        res.writeHead(200); // Respond with 200 OK
                        res.end('Invitation declined successfully'); // Send success message
                    }
                });
            }
        });
    // Handling requests to fetch users data
    } else if (req.method === 'GET' && req.url === '/users') { // Check if request is GET and URL is /users
        fs.readFile(usersFilePath, 'utf8', (err, data) => { // Reading users database
            if (err) { // Check for error in reading file
                res.writeHead(500); // Respond with 500 Internal Server Error
                res.end('Error: Could not fetch users'); // Send error message
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' }); // Respond with 200 OK and JSON content type
                res.end(data); // Send users data
            }
        });
    // Handling requests to create a team
    } else if (req.method === 'POST' && req.url === '/create-team') { // Check if request is POST and URL is /create-team
        let body = ''; // Initialize variable to store request body
        req.on('data', (chunk) => {
            body += chunk.toString(); // Collecting data chunks
        });
        req.on('end', () => {
            const teamData = JSON.parse(body); // Parsing the collected data
            const { teamName, members, username } = teamData; // Extracting team data

            // Reading users database
            fs.readFile(usersFilePath, 'utf8', (err, data) => {
                if (err) { // Check for error in reading file
                    res.writeHead(500); // Respond with 500 Internal Server Error
                    res.end(JSON.stringify({ success: false, message: 'Error: Could not read user data' })); // Send error message
                    return; // Exit function
                }

                const users = JSON.parse(data); // Parse users data

                // Update the group for the user who created the team
                const user = users.find(user => user.username === username); // Find user by username
                if (user) { // Check if user exists
                    user.group.push(teamName); // Add team name to user's group
                }

                // Add the group to invitations for all members
                members.forEach(memberName => {
                    const member = users.find(user => user.username === memberName); // Find member by username
                    if (member) { // Check if member exists
                        member.invitations.push(teamName); // Add team name to member's invitations
                    }
                });

                // Writing updated users data to file
                fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
                    if (err) { // Check for error in writing file
                        res.writeHead(500); // Respond with 500 Internal Server Error
                        res.end(JSON.stringify({ success: false, message: 'Error: Could not save user data' })); // Send error message
                    } else {
                        res.writeHead(200); // Respond with 200 OK
                        res.end(JSON.stringify({ success: true, message: 'Team created successfully' })); // Send success message
                    }
                });
            });
        });
    // Handling requests to fetch events data
    } else if (req.url === '/events' && req.method === 'GET') { // Check if request is GET and URL is /events
        fs.readFile(eventsFilePath, 'utf8', (error, data) => { // Reading events database
            if (error) { // Check for error in reading file
                res.writeHead(500, { 'Content-Type': 'text/plain' }); // Respond with 500 Internal Server Error and text/plain content type
                res.end('Error: Could not read events file'); // Send error message
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' }); // Respond with 200 OK and JSON content type
                res.end(data); // Send events data
            }
        });
    // Handling requests to create an event
    } else if (req.url === '/events' && req.method === 'POST') { // Check if request is POST and URL is /events
        let body = ''; // Initialize variable to store request body

        req.on('data', chunk => {
            body += chunk.toString(); // Collecting data chunks
        });

        req.on('end', () => {
            try {
                const newEvent = JSON.parse(body); // Parsing the collected data

                // Reading events database
                fs.readFile(eventsFilePath, 'utf8', (error, data) => {
                    if (error) { // Check for error in reading file
                        res.writeHead(500, { 'Content-Type': 'text/plain' }); // Respond with 500 Internal Server Error and text/plain content type
                        res.end('Error: Could not read events file'); // Send error message
                        return; // Exit function
                    }

                    const events = JSON.parse(data); // Parse events data
                    events.push(newEvent); // Add new event to events array

                    // Writing updated events data to file
                    fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2), 'utf8', (error) => {
                        if (error) { // Check for error in writing file
                            res.writeHead(500, { 'Content-Type': 'text/plain' }); // Respond with 500 Internal Server Error and text/plain content type
                            res.end('Error: Could not write to events file'); // Send error message
                            return; // Exit function
                        }

                        res.writeHead(200, { 'Content-Type': 'text/plain' }); // Respond with 200 OK and text/plain content type
                        res.end('Event added successfully'); // Send success message
                    });
                });
            } catch (error) { // Catch JSON parsing error
                res.writeHead(400, { 'Content-Type': 'text/plain' }); // Respond with 400 Bad Request and text/plain content type
                res.end('Error: Invalid JSON'); // Send error message
            }
        });
    // Handling requests to delete an event
    } else if (req.url.startsWith('/events/') && req.method === 'DELETE') { // Check if request is DELETE and URL starts with /events/
        let body = ''; // Initialize variable to store request body

        req.on('data', chunk => {
            body += chunk.toString(); // Collecting data chunks
        });

        req.on('end', () => {
            try {
                const eventToDelete = JSON.parse(body); // Parsing the collected data
                const eventDate = decodeURIComponent(req.url.split('/events/')[1]); // Extract event date from URL

                // Reading events database
                fs.readFile(eventsFilePath, 'utf8', (error, data) => {
                    if (error) { // Check for error in reading file
                        res.writeHead(500, { 'Content-Type': 'text/plain' }); // Respond with 500 Internal Server Error and text/plain content type
                        res.end('Error: Could not read events file'); // Send error message
                        return; // Exit function
                    }

                    let events = JSON.parse(data); // Parse events data
                    events = events.filter(event => event.date !== eventDate || event.title !== eventToDelete.title); // Remove event with matching date and title

                    // Writing updated events data to file
                    fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2), 'utf8', (error) => {
                        if (error) { // Check for error in writing file
                            res.writeHead(500, { 'Content-Type': 'text/plain' }); // Respond with 500 Internal Server Error and text/plain content type
                            res.end('Error: Could not write to events file'); // Send error message
                            return; // Exit function
                        }

                        res.writeHead(200, { 'Content-Type': 'text/plain' }); // Respond with 200 OK and text/plain content type
                        res.end('Event deleted successfully'); // Send success message
                    });
                });
            } catch (error) { // Catch JSON parsing error
                res.writeHead(400, { 'Content-Type': 'text/plain' }); // Respond with 400 Bad Request and text/plain content type
                res.end('Error: Invalid JSON'); // Send error message
            }
        });
    // Handling requests to fetch user groups
    } else if (req.method === 'GET' && req.url.startsWith('/user-groups')) { // Check if request is GET and URL starts with /user-groups
        const queryObject = url.parse(req.url, true).query; // Parse URL query parameters
        const username = queryObject.username; // Extract username from query parameters
        
        if (!username) { // Check if username is not provided
            res.writeHead(400, { 'Content-Type': 'application/json' }); // Respond with 400 Bad Request and JSON content type
            res.end(JSON.stringify({ error: 'Username is required' })); // Send error message
            return; // Exit function
        }
    
        // Reading users database
        fs.readFile(usersFilePath, 'utf8', (err, data) => {
            if (err) { // Check for error in reading file
                res.writeHead(500, { 'Content-Type': 'application/json' }); // Respond with 500 Internal Server Error and JSON content type
                res.end(JSON.stringify({ error: 'Could not read user data' })); // Send error message
                return; // Exit function
            }
    
            const users = JSON.parse(data); // Parse users data
            const user = users.find(user => user.username === username); // Find user by username
    
            if (!user) { // Check if user does not exist
                res.writeHead(404, { 'Content-Type': 'application/json' }); // Respond with 404 Not Found and JSON content type
                res.end(JSON.stringify({ error: 'User not found' })); // Send error message
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' }); // Respond with 200 OK and JSON content type
                res.end(JSON.stringify({ groups: user.group })); // Send user groups data
            }
        }); 
    // Handling requests to add a new member to a team
    } else if (req.method === 'POST' && req.url === '/addNewMember') { // Check if request is POST and URL is /addNewMember
        let body = ''; // Initialize variable to store request body
        req.on('data', (chunk) => {
            body += chunk.toString(); // Collecting data chunks
        });
        req.on('end', () => {
            try {
                const teamData = JSON.parse(body); // Parsing the collected data
                const { teamName, members } = teamData; // Extracting team data
    
                // Reading users database
                fs.readFile(usersFilePath, 'utf8', (err, data) => {
                    if (err) { // Check for error in reading file
                        res.writeHead(500); // Respond with 500 Internal Server Error
                        res.end(JSON.stringify({ success: false, message: 'Error: Could not read user data' })); // Send error message
                        return; // Exit function
                    }
    
                    const users = JSON.parse(data); // Parse users data
                    let updated = false; // Initialize updated flag as false
    
                    members.forEach(memberName => {
                        const member = users.find(user => user.username === memberName); // Find member by username
                        if (member) { // Check if member exists
                            member.invitations.push(teamName); // Add team name to member's invitations
                            updated = true; // Set updated flag to true
                        }
                    });
    
                    if (updated) { // Check if any member was updated
                        // Writing updated users data to file
                        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
                            if (err) { // Check for error in writing file
                                res.writeHead(500); // Respond with 500 Internal Server Error
                                res.end(JSON.stringify({ success: false, message: 'Error: Could not save user data' })); // Send error message
                            } else {
                                res.writeHead(200); // Respond with 200 OK
                                res.end(JSON.stringify({ success: true, message: 'Team created successfully' })); // Send success message
                            }
                        });
                    } else {
                        res.writeHead(404); // Respond with 404 Not Found
                        res.end(JSON.stringify({ success: false, message: 'No users found to update' })); // Send error message
                    }
                });
            } catch (error) { // Catch JSON parsing error
                res.writeHead(400); // Respond with 400 Bad Request
                res.end(JSON.stringify({ success: false, message: 'Error: Invalid JSON' })); // Send error message
            }
        });
    // Serving static files
    } else {
        let filePath = req.url === '/' ? '/html/login.html' : req.url; // Determine file path based on URL

        if (filePath === '/post') {
            filePath = '/html/post.html'; // Set file path for post page
        } else if (filePath === '/groups') {
            filePath = '/html/groups.html'; // Set file path for groups page
        } else if (filePath === '/calendar') {
            filePath = '/html/calendar.html'; // Set file path for calendar page
        } else if (filePath === '/signup') {
            filePath = '/html/signup.html'; // Set file path for signup page
        } else if (filePath === '/coffeebreak') {
            filePath = '/html/coffeebreak.html'; // Set file path for coffee break page
        } else if (filePath === '/invitation') {
            filePath = '/html/invitation.html'; // Set file path for invitation page
        } else if (filePath === '/create') {
            filePath = '/html/create.html'; // Set file path for create page
        } else if (filePath === '/login') {
            filePath = '/html/login.html'; // Set file path for login page
        } else if (filePath === '/teamcohesion') {
            filePath = '/html/teamcohesion.html'; // Set file path for team cohesion page
        }

        filePath = path.join(__dirname, '../PublicResources', filePath); // Join the file path with base directory

        // Reading the requested file
        fs.readFile(filePath, (error, data) => {
            if (error) { // Check for error in reading file
                if (error.code === 'ENOENT') { // Check if file not found
                    res.writeHead(404); // Respond with 404 Not Found
                    res.end('Error: File not found'); // Send error message
                } else {
                    res.writeHead(500); // Respond with 500 Internal Server Error
                    res.end('Error: Internal Server Error'); // Send error message
                }
            } else {
                let contentType = 'text/plain'; // Set default content type
                const ext = path.extname(filePath); // Get file extension
                if (ext === '.html') {
                    contentType = 'text/html'; // Set content type for HTML files
                } else if (ext === '.css') {
                    contentType = 'text/css'; // Set content type for CSS files
                } else if (ext === '.js') {
                    contentType = 'text/javascript'; // Set content type for JavaScript files
                }

                res.writeHead(200, { 'Content-Type': contentType }); // Respond with 200 OK and appropriate content type
                res.end(data); // Send file data
            }
        });
    }
});
// Function to add new user to database
function addNewUserToDatabase(newUser, callback) {
    const databasePath = path.join(__dirname, '../PublicResources/data', 'users.json'); // Path to users database

    fs.readFile(databasePath, 'utf8', (err, data) => { // Reading users database
        if (err && err.code !== 'ENOENT') { // Check for error in reading file and file not found error
            return callback(err); // Return error through callback
        }

        let users;
        try {
            users = data ? JSON.parse(data) : []; // Parse user data or initialize as empty array
        } catch (parseError) { // Check for parsing error
            return callback(parseError); // Return error through callback
        }

        const existingUser = users.find(user => user.username === newUser.username); // Find if username already exists
        if (existingUser) { // Check if username already exists
            return callback(new Error('Username already exists')); // Return error through callback
        }

        users.push(newUser); // Add new user to users array

        fs.writeFile(databasePath, JSON.stringify(users, null, 2), callback); // Write updated users data to file
    });
}

let nextIndex = 0; // Initialize next index for posts

function appendPostToDatabase(postData, callback) {
    const databasePath = path.join(__dirname, '../PublicResources/data', 'posts.json'); // Path to posts database

    fs.readFile(databasePath, 'utf8', (err, data) => { // Reading posts database
        if (err) {
            if (err.code === 'ENOENT') { // Check if file not found
                data = '[]'; // Initialize data as empty array
            } else {
                return callback(err); // Return error through callback
            }
        }

        const posts = JSON.parse(data); // Parse posts data

        postData.likes = postData.likes || 0; // Initialize likes to 0 if not provided
        postData.dislikes = postData.dislikes || 0; // Initialize dislikes to 0 if not provided
        postData.comments = postData.comments || []; // Initialize comments as empty array
        postData.pinned = postData.pinned || false; // Initialize pinned status to false
        postData.likedBy = postData.likedBy || []; // Initialize likedBy as empty array
        postData.dislikedBy = postData.dislikedBy || []; // Initialize dislikedBy as empty array
        postData.index = nextIndex++; // Set post index
        
        posts.push(postData); // Add new post to posts array
        fs.writeFile(databasePath, JSON.stringify(posts, null, 2), callback); // Write updated posts data to file
    });
}

// Function to update post likes or dislikes
function updatePostLikesOrDislikes(postId, action, username, callback) {
    const databasePath = path.join(__dirname, '../PublicResources/data', 'posts.json'); // Path to posts database

    fs.readFile(databasePath, 'utf8', (err, data) => { // Reading posts database
        if (err) {
            return callback(err); // Return error through callback
        }

        const posts = JSON.parse(data); // Parse posts data
        const post = posts.find(post => post.id === postId); // Find post by ID

        if (post) { // Check if post exists
            post.likedBy = post.likedBy || []; // Initialize likedBy array if undefined
            post.dislikedBy = post.dislikedBy || []; // Initialize dislikedBy array if undefined

            if (action === 'like') {
                if (!post.likedBy.includes(username)) { // Check if user has not liked the post
                    post.likes = (post.likes || 0) + 1; // Increment likes
                    post.likedBy.push(username); // Add user to likedBy array
                    post.dislikedBy = post.dislikedBy.filter(user => user !== username); // Remove user from dislikedBy array
                }
            } else if (action === 'dislike') {
                if (!post.dislikedBy.includes(username)) { // Check if user has not disliked the post
                    post.dislikes = (post.dislikes || 0) + 1; // Increment dislikes
                    post.dislikedBy.push(username); // Add user to dislikedBy array
                    post.likedBy = post.likedBy.filter(user => user !== username); // Remove user from likedBy array
                }
            } else if (action === 'unlike') {
                if (post.likedBy.includes(username)) { // Check if user has liked the post
                    post.likes = Math.max((post.likes || 1) - 1, 0); // Decrement likes
                    post.likedBy = post.likedBy.filter(user => user !== username); // Remove user from likedBy array
                }
            } else if (action === 'undislike') {
                if (post.dislikedBy.includes(username)) { // Check if user has disliked the post
                    post.dislikes = Math.max((post.dislikes || 1) - 1, 0); // Decrement dislikes
                    post.dislikedBy = post.dislikedBy.filter(user => user !== username); // Remove user from dislikedBy array
                }
            }

            fs.writeFile(databasePath, JSON.stringify(posts, null, 2), (writeErr) => { // Write updated posts data to file
                if (writeErr) {
                    console.log('Error writing file:', writeErr); // Log error
                    return callback(writeErr); // Return error through callback
                }
                callback(null); // Return success through callback
            });
        } else {
            callback(new Error('Post not found')); // Return error through callback
        }
    });
}

// Function to add comment to a post
function addCommentToPost(postId, commentData, callback) {
    const databasePath = path.join(__dirname, '../PublicResources/data', 'posts.json'); // Path to posts database

    fs.readFile(databasePath, 'utf8', (err, data) => { // Reading posts database
        if (err) {
            return callback(err); // Return error through callback
        }

        const posts = JSON.parse(data); // Parse posts data
        const post = posts.find(post => post.id === postId); // Find post by ID

        if (post) { // Check if post exists
            if (!post.comments) {
                post.comments = []; // Initialize comments array if undefined
            }
            post.comments.push(commentData); // Add comment to comments array

            fs.writeFile(databasePath, JSON.stringify(posts, null, 2), (writeErr) => { // Write updated posts data to file
                if (writeErr) {
                    console.error('Error writing file:', writeErr); // Log error
                    return callback(writeErr); // Return error through callback
                }
                console.log('Comment successfully added'); // Log success message
                callback(null); // Return success through callback
            });
        } else {
            console.error('Post not found:', postId); // Log error
            callback(new Error('Post not found')); // Return error through callback
        }
    });
}

// Function to pin a post
function pinPost(postId, callback) {
    const databasePath = path.join(__dirname, '../PublicResources/data', 'posts.json'); // Path to posts database

    fs.readFile(databasePath, 'utf8', (err, data) => { // Reading posts database
        if (err) {
            return callback(err); // Return error through callback
        }

        const posts = JSON.parse(data); // Parse posts data
        const post = posts.find(post => post.id === postId); // Find post by ID

        if (post) { // Check if post exists
            posts.forEach(p => p.pinned = false); // Unpin all posts
            post.pinned = true; // Pin the selected post

            fs.writeFile(databasePath, JSON.stringify(posts, null, 2), (writeErr) => { // Write updated posts data to file
                if (writeErr) {
                    console.log('Error writing file:', writeErr); // Log error
                    return callback(writeErr); // Return error through callback
                }
                console.log('Post successfully pinned'); // Log success message
                callback(null); // Return success through callback
            });
        } else {
            console.log('Post not found:', postId); // Log error
            callback(new Error('Post not found')); // Return error through callback
        }
    });
}

// Function to unpin a post
function unpinPost(postId, callback) {
    const databasePath = path.join(__dirname, '../PublicResources/data', 'posts.json'); // Path to posts database

    fs.readFile(databasePath, 'utf8', (err, data) => { // Reading posts database
        if (err) {
            return callback(err); // Return error through callback
        }

        const posts = JSON.parse(data); // Parse posts data
        const post = posts.find(post => post.id === postId); // Find post by ID

        if (post) { // Check if post exists
            post.pinned = false; // Unpin the selected post

            fs.writeFile(databasePath, JSON.stringify(posts, null, 2), (writeErr) => { // Write updated posts data to file
                if (writeErr) {
                    console.log('Error writing file:', writeErr); // Log error
                    return callback(writeErr); // Return error through callback
                }
                console.log('Post successfully unpinned'); // Log success message
                callback(null); // Return success through callback
            });
        } else {
            console.log('Post not found:', postId); // Log error
            callback(new Error('Post not found')); // Return error through callback
        }
    });
}

// Function to append user data to database
function appendUsersToDatabase(usersData, callback) {
    const databasePath = path.join(__dirname, '../PublicResources/data', 'users.json'); // Path to users database

    fs.readFile(databasePath, 'utf8', (err, data) => { // Reading users database
        if (err) {
            if (err.code === 'ENOENT') { // Check if file not found
                data = '[]'; // Initialize data as empty array
            } else {
                return callback(err); // Return error through callback
            }
        }

        let users = JSON.parse(data); // Parse users data

        const index = users.findIndex(user => user.username === usersData.username); // Find user by username

        if (index !== -1) { // Check if user exists
            users[index].invitations = users[index].invitations.filter(invitation => invitation !== usersData.invitation); // Remove invitation from user's invitations
            users[index].group.push(usersData.invitation); // Add invitation to user's group
        } else {
            console.error('User not found:', usersData.username); // Log error
        }

        fs.writeFile(databasePath, JSON.stringify(users, null, 2), callback); // Write updated users data to file
    });
}

// Function to remove invitation from user
function removeInvitationFromUser(userData, callback) {
    const databasePath = path.join(__dirname, '../PublicResources/data', 'users.json'); // Path to users database

    fs.readFile(databasePath, 'utf8', (err, data) => { // Reading users database
        if (err) {
            if (err.code === 'ENOENT') { // Check if file not found
                data = '[]'; // Initialize data as empty array
            } else {
                return callback(err); // Return error through callback
            }
        }

        let users = JSON.parse(data); // Parse users data

        const index = users.findIndex(user => user.username === userData.username); // Find user by username

        if (index !== -1) { // Check if user exists
            users[index].invitations = users[index].invitations.filter(invitation => invitation !== userData.invitation); // Remove invitation from user's invitations
        } else {
            console.error('User not found:', userData.username); // Log error
        }

        fs.writeFile(databasePath, JSON.stringify(users, null, 2), callback); // Write updated users data to file
    });
}

// Start the server on the specified port
const PORT = process.env.PORT || 3240; // Set port to environment variable or default to 3240
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Log message indicating server is running
});
