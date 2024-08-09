const express = require("express");
const router = express.Router();
const BookingController = require("../../controllers/booking-controller");


router.post("/bookFlight", BookingController.createBooking);


router.patch("/bookings/:id", BookingController.updateBooking);

router.get("/bookings/:id", BookingController.getBooking);

module.exports = router;
