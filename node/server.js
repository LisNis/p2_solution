const express = require('express');
const app = express();
const port = 3000;

// create the http server
const server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html'});
});

// Include route files
const usersRoute = require('./routes');

// Use routes
app.use('/user', userRoute);


server.listen(port, function(error) {
    if (error) {
        console.log('Something went wrong');
    } else {
        console.log('Server is listening to port ' + port);
    }
});