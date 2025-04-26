let waitingUser = null;

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('ready', () => {
        if (waitingUser && waitingUser !== socket) {
            // Match them
            socket.emit('match', waitingUser.id);
            waitingUser.emit('match', socket.id);
            waitingUser = null;
        } else {
            // No one waiting
            waitingUser = socket;
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (waitingUser === socket) {
            waitingUser = null;
        }
        socket.broadcast.emit('partner-disconnected');
    });

    socket.on('offer', (offer) => {
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer);
    });

    socket.on('ice-candidate', (candidate) => {
        socket.broadcast.emit('ice-candidate', candidate);
    });
});
