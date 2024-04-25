const express = require('express');
const router = express.Router();
const { Posts } = require('../models');

router.get('/', async (req, res) => {
    const listOfPosts = await Posts.findAll();
    res.json(listOfPost);
});

// post request to the routes
router.post('/', async (req, res) => {
    const post = req.body; // grab the post data from the body
    await Posts.create(post); // sequelizes, inserts into the table
    res.json(post); // send it again, a conformation
});
 
module.exports = router;