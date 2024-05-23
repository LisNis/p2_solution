const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../PublicResources/data', 'users.json');

function createGroup(groupData, callback) {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return callback(err);
        }

        const users = JSON.parse(data);

        // Update the group for the user who created the group
        const user = users.find(user => user.username === groupData.username);
        if (user) {
            user.group.push(groupData.groupName);
        }

        // Add the group to invitations for all members
        groupData.members.forEach(memberName => {
            const member = users.find(user => user.username === memberName);
            if (member) {
                member.invitations.push(groupData.groupName);
            }
        });

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), callback);
    });
}

module.exports = {
    createGroup
};
