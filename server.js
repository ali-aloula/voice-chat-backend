const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an express app
const app = express();

// Create an HTTP server to work with Socket.IO
const server = http.createServer(app);

// Create a Socket.IO instance attached to the HTTP server
const io = socketIo(server, {
    cors: {
        origin: "https://wow.buy-scripts.com", // Allow your frontend domain
        methods: ["GET", "POST"], // Allow GET and POST methods
        allowedHeaders: ["Content-Type"], // Allow Content-Type header
        credentials: true, // Allow cookies to be sent across origins
    },
});

let users = [];

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on('ready', () => {
        console.log(`${socket.id} is ready`);
        users.push(socket.id);

        // Check if there are two users ready, then match them
        if (users.length >= 2) {
            const user1 = users.pop(); // First user in the queue
            const user2 = users.pop(); // Second user in the queue
            console.log('Matched users:', user1, user2);

            // Emit the "match" event to both users
            io.to(user1).emit('match', user2);
            io.to(user2).emit('match', user1);
        }
    });

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        users = users.filter(id => id !== socket.id);  // Remove disconnected user
        io.emit('partner-disconnected');  // Notify all clients
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
