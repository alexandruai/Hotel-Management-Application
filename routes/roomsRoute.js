const express = require("express");
const router = express.Router();
const Room = require('../models/room');

router.get("/getallrooms", async (req, res) => {
    try {
        const rooms = await Room.find({});
        return res.send(rooms);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
});

router.post("/getroombyid", async (req, res) => {
    console.log(req.body);
    try {
        const room = await Room.findOne({ '_id': req.body.roomId });
        res.send(room);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

router.post("/addroom", async (req, res) => {
    const { room, rentperday, maxcount, description, phonenumber, type, status, image1, image2, image3, issues } = req.body;

    const newroom = new Room({
        name: room,
        rentperday,
        maxcount,
        description,
        phonenumber,
        type,
        status,
        imageurls: [image1, image2, image3],
        currentbookings: [],
        issues: issues
    });

    try {
        await newroom.save();
        res.send('New Room Added Successfully');
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

router.delete("/deleteroom/:roomId", async (req, res) => {
    const roomId = req.params.roomId;
    try {
        const deletedRoom = await Room.findByIdAndDelete(roomId);
        if (!deletedRoom) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.send("Room deleted successfully");
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Block a room
router.post("/blockroom", async (req, res) => {
    const { roomId, reason, userId } = req.body;
    try {
        console.log("Req ", req.body)
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        room.status = "BLOCATA";
        console.log("Room before save ", room.issues);
        console.log("User ", userId);
        room.issues.push({ description: reason, reportedBy: userId });
        console.log("Room After save ", room.issues);
        await room.save();
        res.send("Room blocked successfully");
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

router.post("/getroomissues", async (req, res) => {
    try {
        const room = await Room.findById(req.body.roomId).populate('issues.reportedBy', 'name');
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.send(room.issues);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

module.exports = router;