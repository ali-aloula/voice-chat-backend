const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

let waitingUser = null;

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    if (waitingUser) {
        // Pair with waiting user
        socket.emit('match', waitingUser.id);
        waitingUser.emit('match', socket.id);
        waitingUser = null;
    } else {
        // No one waiting, store current user
        waitingUser = socket;
    }

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (waitingUser === socket) {
            waitingUser = null;
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
