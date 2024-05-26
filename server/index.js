const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
var cors = require('cors')
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`New client connected`);

  socket.on('message', ({ user, message }) => {
    io.emit('message', { user, message });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected`);
  });
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
