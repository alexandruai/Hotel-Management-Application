const express = require("express");
const router = express.Router();
const Room = require('../models/room');
const moment = require('moment');

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

router.post("/updateroomstatus", async (req, res) => {
    const { roomid, status } = req.body;
    try {
        const room = await Room.findById(roomid);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        room.status = status;
        await room.save();
        res.send("Room status updated successfully");
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});


router.post("/getavailable", async (req, res) => {
    const { fromDate, toDate, type } = req.body;
    console.log("Date ", { fromDate, toDate });

    // Parsing dates in DD-MM-YYYY format
    const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split('-');
        return new Date(`${year}-${month}-${day}T00:00:00Z`);
    };

    const fromDateObj = parseDate(fromDate);
    const toDateObj = parseDate(toDate);

    if (isNaN(fromDateObj) || isNaN(toDateObj)) {
        return res.status(400).json({ message: "Invalid date values provided." });
    }

    const fromDateString = fromDateObj.toISOString();
    const toDateString = toDateObj.toISOString();
    console.log("Converted dates to strings:", { fromDateString, toDateString });

    try {
        const rooms = await Room.find({
            status: { $ne: "BLOCATA" },
            // Uncomment if type filter is needed
            // type: type !== 'all' ? type : { $exists: true },
            $or: [
                { currentbookings: { $size: 0 } },
                {
                    currentbookings: {
                        $not: {
                            $elemMatch: {
                                $or: [
                                    { fromdate: { $lte: toDateString, $gte: fromDateString } },
                                    { todate: { $lte: toDateString, $gte: fromDateString } },
                                    { fromdate: { $lte: fromDateString }, todate: { $gte: toDateString } }
                                ]
                            }
                        }
                    }
                }
            ]
        });

        console.log("Rooms found:", rooms);
        res.send(rooms);
    } catch (error) {
        console.log("Error finding rooms:", error);
        return res.status(400).json({ message: error.message });
    }
});


  
  
router.post("/addissue", async (req, res) => {
    const { roomid, description, userid } = req.body;
    try {
        const room = await Room.findById(roomid);
        if (!room) {
            return res.status(404).json({ message: "Camera nu a fost gasita" });
        }
        room.issues.push({ description, reportedBy: userid });
        await room.save();
        res.send("Problema adaugata cu succes pentru camera selectata");
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

router.post("/checkin", async (req, res) => {
    const { roomid, clientName, clientEmail } = req.body;
    try {
        const room = await Room.findById(roomid);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        const userType = "client";
        room.status = "OCUPATA";
        room.history.push({ action: "CHECK IN", clientName, clientEmail, userType });
        await room.save();
        res.send("Check-in successful");
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

router.post("/checkout", async (req, res) => {
    const { roomid, clientName, clientEmail } = req.body;
    try {
        const room = await Room.findById(roomid);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        const userType = "client";
        room.status = "LIBERA";
        room.history.push({ action: "CHECK OUT", clientName, clientEmail, userType });
        await room.save();
        res.send("Check-out successful");
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

router.get("/clienthistory", async (req, res) => {
    try {
        // Fetch all rooms
        const rooms = await Room.find({});

        const filteredRooms = rooms.filter(room => room.history.length > 0);

        // Filter out rooms with empty histories and map the remaining histories
        const histories = filteredRooms
            .flatMap(room =>
                room.history.map(history => ({
                    history,
                    roomName: room.name
                }))
            );

        console.log("Histories:", histories);
        res.send(histories);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});



module.exports = router;