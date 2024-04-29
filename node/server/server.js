const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');

const hostname = '127.0.0.1';
const port = 3250;

//const serverName = "https://cs-24-dat-2-04.p2datsw.cs.aau.dk/node0/";
const serverName = "http://localhost:3240";

const DBConnection = mysql.createConnection({
    host: 'localhost',
    user: 'cs-24-dat-2-04.p2datsw.cs.aau.dk',
    password: '################',
    database: 'staff'
});
    
DBConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1);
    }
    console.log('MySQL Connected!');
});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

/*const express = require('express');
const app = express();
const port = 3240;

app.use(express.json());

const db = require('./models');

// Include route files
const postRoute = require('./routes/Posts');

// Use routes
app.use('/posts', postRoute);



db.sequelize.sync().then(() => {
    app.listen(port, function(error) {
        if (error) {
            console.log('Something went wrong');
        } else {
            console.log('Server is listening to port ' + port);
        }
    });
});
*/