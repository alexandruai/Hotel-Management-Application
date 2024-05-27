const express = require("express");
const router = express.Router();
const Room = require('../models/room');

router.get("/getallrooms", async (req, res) => {
    try {
        const rooms = await Room.find({});
        console.log(rooms);
        console.log("Number of Rooms", rooms.length);
        return res.send(rooms);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error });
    }
});

router.post("/getroombyid", async(req, res) => {
    console.log(req.body);
    try {
         const room = await Room.findOne({'_id' : req.body.roomid})
         res.send(room)
    } catch (error) {
         return res.status(400).json({ message: error });
    }
});

router.post("/addroom", async(req, res) => {
    const { room , 
       rentperday, maxcount ,description ,phonenumber ,type ,image1 ,image2 ,image3} = req.body
  
       const newroom = new Room({
            name : room,
            rentperday, 
            maxcount , description , phonenumber , type , imageurls:[image1 , image2 ,image3] , currentbookings:[]
       })
       try {
            await newroom.save()
            res.send('New Room Added Successfully')
       } catch (error) {
            return res.status(400).json({ error });
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
         return res.status(400).json({ message: error });
     }
 });

module.exports = router;