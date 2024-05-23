const fs = require('fs');
const path = require('path');

const commentsFilePath = path.join(__dirname, '../PublicResources', 'comments.json');

function addComment(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const newComment = JSON.parse(body);

            fs.readFile(commentsFilePath, 'utf8', (error, data) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error: Could not read comments file');
                    return;
                }

                const comments = JSON.parse(data);
                comments.push(newComment);

                fs.writeFile(commentsFilePath, JSON.stringify(comments, null, 2), 'utf8', (error) => {
                    if (error) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error: Could not write to comments file');
                        return;
                    }

                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Comment added successfully');
                });
            });
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Error: Invalid JSON');
        }
    });
}

module.exports = {
    addComment
};
