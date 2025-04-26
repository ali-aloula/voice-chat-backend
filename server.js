// Importing required modules
const http = require('http');
const socketIo = require('socket.io');

// Creating an HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Socket.IO server');
});

// Setting up the Socket.IO server with CORS configurations
const io = socketIo(server, {
    cors: {
        origin: "*", // Allows all origins (use cautiously in production)
        methods: ["GET", "POST"]
    }
});

// Handling incoming socket connections
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Emitting a message to the client
    socket.emit('message', 'Welcome to the chat!');
    
    // Listening for custom events from the client
    socket.on('chatMessage', (msg) => {
        console.log('Message from client: ' + msg);
    });

    // Handling disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Starting the server
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
