const express = require('express');
const DeviceConnection = require('../models/DeviceConnection');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Create Connection
router.post('/create', async (req, res) => {
    const { userId } = req.body;
    const deviceCode = uuidv4();
    const connection = await DeviceConnection.create({ userId, deviceCode });
    res.json({ deviceCode });
});

// Connect with code
router.post('/connect', async (req, res) => {
    const { deviceCode, connectedDeviceId } = req.body;
    const device = await DeviceConnection.findOne({ deviceCode });
    if (!device) return res.status(404).json({ message: "Device code not found" });

    device.connectedDeviceId = connectedDeviceId;
    await device.save();
    res.json({ success: true });
});

// Update location
router.post('/update-location', async (req, res) => {
    const { deviceCode, lat, lng } = req.body;
    const device = await DeviceConnection.findOne({ deviceCode });
    if (!device) return res.status(404).json({ message: "Device not found" });

    device.history.push({ lat, lng, timestamp: new Date() });
    await device.save();
    res.json({ success: true });
});

// Get location history
router.get('/history/:deviceCode', async (req, res) => {
    const device = await DeviceConnection.findOne({ deviceCode: req.params.deviceCode });
    if (!device) return res.status(404).json({ message: "Device not found" });
    res.json(device.history);
});

module.exports = router;
