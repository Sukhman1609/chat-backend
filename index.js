// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const PORT = 4001;
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*',
    },
});

app.get('/', (req, res) => {
    res.send('API Is running Fine');
});

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('Msg', (message) => {
        io.emit('Msg', message); 
    });

    socket.on('BroadcastMsg', (message) => {
        io.emit('BroadCAstMsgFRomServer', message);
    });

    socket.on('ExclusiveBroadcastMsg', (message) => {
        socket.broadcast.emit('ExclusiveBroadcastMssg', message);
    });

    socket.on('JoinRoom', (joinedRoom) => {
        console.log(`Socket ${socket.id} joined room ${joinedRoom}`);
        socket.join(joinedRoom);
        io.to(joinedRoom).emit('JoinRoomSuccessfully', `Socket ${socket.id} joined room ${joinedRoom}`);
    });

    socket.on('SendJoinRoomMsg', (data) => {
        const [joinedRoom, message] = data;
        console.log(`Received message in room ${joinedRoom}: ${message}`);
        io.to(joinedRoom).emit('Msg', message);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
