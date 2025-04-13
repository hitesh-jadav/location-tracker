const mongoose = require('mongoose');

const deviceConnectionSchema = new mongoose.Schema({
    userId: String,
    deviceCode: String,
    connectedDeviceId: String,
    history: [
        {
            lat: Number,
            lng: Number,
            timestamp: Date
        }
    ]
});

module.exports = mongoose.model('DeviceConnection', deviceConnectionSchema);
