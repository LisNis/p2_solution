const express = require('express');
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
