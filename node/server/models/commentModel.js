const fs = require('fs');
const path = require('path');

const commentsFilePath = path.join(__dirname, '../PublicResources/data', 'users.json');

function addComment(commentData, callback) {
    fs.readFile(commentsFilePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                data = '[]';
            } else {
                return callback(err);
            }
        }

        const comments = JSON.parse(data);
        comments.push(commentData);

        fs.writeFile(commentsFilePath, JSON.stringify(comments, null, 2), callback);
    });
}

module.exports = {
    addComment
};
