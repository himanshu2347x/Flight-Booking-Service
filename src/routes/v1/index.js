const express = require("express");
const router = express.Router();
const BookingController = require("../../controllers/booking-controller");

const bookingController = new BookingController();
router.post("/bookFlight", bookingController.createBooking);

router.post('/publish', bookingController.sendMessageToQueue);
router.patch("/bookings/:id", bookingController.updateBooking);

router.get("/bookings/:id", bookingController.getBooking);

module.exports = router;
