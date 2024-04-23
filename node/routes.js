const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send({data: "Here is your data"});
});

router.post('/', (req, res) => {
    res.send({data: "User created"});
});

router.put('/', (req, res) => {
    res.send({data: "User Updated"});
});

router.delete('/', (req, res) => {
    res.send({data: "User deleted"});
});

// export router module that server.js can use it
module.exports = router;