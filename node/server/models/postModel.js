const fs = require('fs');
const path = require('path');

const postsFilePath = path.join(__dirname, '../PublicResources/data', 'posts.json');

function addPost(postData, callback) {
    fs.readFile(postsFilePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                data = '[]';
            } else {
                return callback(err);
            }
        }

        const posts = JSON.parse(data);

        postData.likes = postData.likes || 0;
        postData.dislikes = postData.dislikes || 0;
        postData.comments = postData.comments || [];
        postData.pinned = postData.pinned || false;
        postData.likedBy = postData.likedBy || [];
        postData.dislikedBy = postData.dislikedBy || [];
        postData.index = posts.length;

        posts.push(postData);
        fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), callback);
    });
}

function updatePostLikesOrDislikes(postId, action, username, callback) {
    fs.readFile(postsFilePath, 'utf8', (err, data) => {
        if (err) {
            return callback(err);
        }

        const posts = JSON.parse(data);
        const post = posts.find(post => post.id === postId);

        if (post) {
            // Initialize likedBy and dislikedBy arrays if they are undefined
            post.likedBy = post.likedBy || [];
            post.dislikedBy = post.dislikedBy || [];

            if (action === 'like') {
                if (!post.likedBy.includes(username)) {
                    post.likes = (post.likes || 0) + 1;
                    post.likedBy.push(username);
                    // Ensure the user is removed from dislikedBy array if they switch from dislike to like
                    post.dislikedBy = post.dislikedBy.filter(user => user !== username);
                }
            } else if (action === 'dislike') {
                if (!post.dislikedBy.includes(username)) {
                    post.dislikes = (post.dislikes || 0) + 1;
                    post.dislikedBy.push(username);
                    // Ensure the user is removed from likedBy array if they switch from like to dislike
                    post.likedBy = post.likedBy.filter(user => user !== username);
                }
            } else if (action === 'unlike') {
                if (post.likedBy.includes(username)) {
                    post.likes = Math.max((post.likes || 1) - 1, 0);
                    post.likedBy = post.likedBy.filter(user => user !== username);
                }
            } else if (action === 'undislike') {
                if (post.dislikedBy.includes(username)) {
                    post.dislikes = Math.max((post.dislikes || 1) - 1, 0);
                    post.dislikedBy = post.dislikedBy.filter(user => user !== username);
                }
            }

            fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error('Error writing file:', writeErr);
                    return callback(writeErr);
                }
                callback(null);
            });
        } else {
            callback(new Error('Post not found'));
        }
    });
}

module.exports = {
    addPost,
    updatePostLikesOrDislikes
};
