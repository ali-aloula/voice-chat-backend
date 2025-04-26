const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Array to keep track of online users (just for matching purposes)
let users = [];

io.on('connection', socket => {
    console.log('New connection:', socket.id);

    socket.on('ready', () => {
        console.log(socket.id, 'is ready');
        users.push(socket.id);
        
        // If there are at least 2 users, match them
        if (users.length >= 2) {
            const user1 = users.pop();
            const user2 = users.pop();
            io.to(user1).emit('match', user2);
            io.to(user2).emit('match', user1);
        }
    });

    socket.on('offer', (offer, partnerId) => {
        io.to(partnerId).emit('offer', offer);
    });

    socket.on('answer', (answer, partnerId) => {
        io.to(partnerId).emit('answer', answer);
    });

    socket.on('ice-candidate', (candidate, partnerId) => {
        io.to(partnerId).emit('ice-candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        users = users.filter(id => id !== socket.id);
        io.emit('partner-disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
