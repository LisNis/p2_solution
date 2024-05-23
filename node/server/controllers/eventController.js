const fs = require('fs');
const path = require('path');

const eventsFilePath = path.join(__dirname, '../PublicResources', 'events.json');

function createEvent(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const newEvent = JSON.parse(body);

            fs.readFile(eventsFilePath, 'utf8', (error, data) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error: Could not read events file');
                    return;
                }

                const events = JSON.parse(data);
                events.push(newEvent);

                fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2), 'utf8', (error) => {
                    if (error) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error: Could not write to events file');
                        return;
                    }

                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Event added successfully');
                });
            });
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Error: Invalid JSON');
        }
    });
}

function deleteEvent(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const eventToDelete = JSON.parse(body);
            const eventDate = decodeURIComponent(req.url.split('/events/')[1]);

            fs.readFile(eventsFilePath, 'utf8', (error, data) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error: Could not read events file');
                    return;
                }

                let events = JSON.parse(data);
                events = events.filter(event => event.date !== eventDate || event.title !== eventToDelete.title);

                fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2), 'utf8', (error) => {
                    if (error) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error: Could not write to events file');
                        return;
                    }

                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Event deleted successfully');
                });
            });
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Error: Invalid JSON');
        }
    });
}

module.exports = {
    createEvent,
    deleteEvent
};
