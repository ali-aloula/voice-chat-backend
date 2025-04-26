const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (your front-end HTML, CSS, JS)
app.use(express.static('public'));

let users = {};

io.on('connection', socket => {
    console.log('User connected: ', socket.id);

    socket.on('join', partnerId => {
        users[socket.id] = partnerId;
        io.to(partnerId).emit('partner-found', socket.id);
    });

    socket.on('offer', data => {
        io.to(data.to).emit('offer', {
            offer: data.offer,
            from: socket.id
        });
    });

    socket.on('answer', data => {
        io.to(data.to).emit('answer', {
            answer: data.answer,
            from: socket.id
        });
    });

    socket.on('ice-candidate', data => {
        io.to(data.to).emit('ice-candidate', {
            candidate: data.candidate,
            from: socket.id
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);
        delete users[socket.id];
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
