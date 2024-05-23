const fs = require('fs');
const path = require('path');

const postsFilePath = path.join(__dirname, '../PublicResources', 'posts.json');

function createPost(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString(); // Buffer to string
    });
    req.on('end', () => {
        const postData = JSON.parse(body);
        postData.id = Date.now();
        postData.likes = postData.likes || 0;
        postData.dislikes = postData.dislikes || 0;
        postData.comments = [];
        postData.pinned = false;

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
}

function getAllPosts(req, res) {
    fs.readFile(postsFilePath, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Error: Could not fetch posts');
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        }
    });
}

module.exports = {
    createPost,
    getAllPosts
};
