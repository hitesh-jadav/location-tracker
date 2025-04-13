const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');



dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

    const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/public')));

const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/device', deviceRoutes);

// app.get('/', (req, res) => {
//     res.send("Welcome to Location Tracker API");
// });



io.on('connection', (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on('locationUpdate', (data) => {
        // broadcast to all clients or handle specifically
        io.emit('locationUpdate', data);
    });

    socket.on('disconnect', () => {
        console.log("Socket disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
