const fs = require('fs');
const path = require('path');

const eventsFilePath = path.join(__dirname, '../PublicResources/data', 'events.json');

function addEvent(eventData, callback) {
    fs.readFile(eventsFilePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                data = '[]';
            } else {
                return callback(err);
            }
        }

        const events = JSON.parse(data);
        events.push(eventData);

        fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2), callback);
    });
}

module.exports = {
    addEvent
};
