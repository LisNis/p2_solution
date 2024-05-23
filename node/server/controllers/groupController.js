const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../PublicResources', 'users.json');

function createTeam(req, res) {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const teamData = JSON.parse(body);
        const { teamName, members, username } = teamData;

        fs.readFile(usersFilePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ success: false, message: 'Error: Could not read user data' }));
                return;
            }

            const users = JSON.parse(data);

            // Update the group for the user who created the team
            const user = users.find(user => user.username === username);
            if (user) {
                user.group.push(teamName);
            }

            // Add the group to invitations for all members
            members.forEach(memberName => {
                const member = users.find(user => user.username === memberName);
                if (member) {
                    member.invitations.push(teamName);
                }
            });

            fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ success: false, message: 'Error: Could not save user data' }));
                } else {
                    res.writeHead(200);
                    res.end(JSON.stringify({ success: true, message: 'Team created successfully' }));
                }
            });
        });
    });
}

module.exports = {
    createTeam
};
