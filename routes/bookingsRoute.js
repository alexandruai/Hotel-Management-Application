const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const stripe = require("stripe")(
  "sk_test_51IYnC0SIR2AbPxU0EiMx1fTwzbZXLbkaOcbc2cXx49528d9TGkQVjUINJfUDAnQMVaBFfBDP5xtcHCkZG1n1V3E800U7qXFmGf"
);
const Booking = require("../models/booking");
const Room = require("../models/room");
const User = require("../models/user");

router.post("/receptionbookroom", async (req, res) => {
  const { room, userid, username, useremail, fromdate, todate, totalDays, totalAmount } = req.body;

  try {
    // Convert incoming date strings to the desired format
    const formattedFromDate = moment(fromdate).format("DD-MM-YYYY");
    const formattedToDate = moment(todate).format("DD-MM-YYYY");

    const newbooking = new Booking({
      userid: userid,
      username: username,
      useremail: useremail,
      room: room.name,
      roomid: room._id,
      totalDays: totalDays,
      fromdate: formattedFromDate,
      todate: formattedToDate,
      totalAmount: totalAmount,
      status: 'REZERVATA',
      statusPayment: 'NEPLATITA'
    });

    // Save the booking instance to the database
    await newbooking.save();

    // Find the old room and update current bookings
    const oldroom = await Room.findOne({ _id: room._id });
    oldroom.currentbookings.push({
      bookingid: newbooking._id,
      fromdate: formattedFromDate,
      todate: formattedToDate,
      userid: userid,
      status: 'REZERVATA'
    });

    await oldroom.save();

    res.send("Room Booked Successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Booking failed", error: error.message });
  }
});

router.post("/bookroom", async (req, res) => {
  const { token, user, room, fromdate, todate, totalDays, totalAmount } = req.body;

  try {

    const newbooking = new Booking({
      userid: user._id,
      username: user.name,
      useremail: user.email,
      room: room.name,
      roomid: room._id,
      totalDays: totalDays,
      fromdate: moment(fromdate, "DD-MM-YYYY").format("DD-MM-YYYY"),
      todate: moment(todate, "DD-MM-YYYY").format("DD-MM-YYYY"),
      totalAmount: totalAmount,
      transactionId: "1234",
      status: 'REZERVATA',
      statusPayment: 'ACHITATA'
    });

    // Save the booking instance to the database
    await newbooking.save();

    // Find the old room and update current bookings
    const oldroom = await Room.findOne({ _id: room._id });
    oldroom.currentbookings.push({
      bookingid: newbooking._id,
      fromdate: moment(fromdate, "DD-MM-YYYY").format("DD-MM-YYYY"),
      todate: moment(todate, "DD-MM-YYYY").format("DD-MM-YYYY"),
      userid: user._id,
      status: 'REZERVATA'
    });

    await oldroom.save();

    res.send("Room Booked Successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Booking failed", error: error.message });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const {bookingid,roomid } = req.body;
  

  try {

    const bookingitem = await Booking.findOne({_id: bookingid}) 
    bookingitem.status='ANULATA'
    await bookingitem.save();
    const room = await Room.findOne({_id:roomid})
    const bookings = room.currentbookings
    const temp=bookings.filter(booking=>booking.bookingid.toString()!==bookingid)
    console.log(temp);
    room.currentbookings=temp;
    room.status = 'LIBERA'
    await room.save()

    res.send('Booking deleted successfully')
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "something went wrong" });
  }
});

router.post("/getuserbookings", async (req, res) => {
  const { userid } = req.body;
  try {
    const bookings = await Booking.find({ userid: userid }).sort({ _id: -1 });
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});


module.exports = router;