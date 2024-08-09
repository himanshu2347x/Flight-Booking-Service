const BookingService = require("../services/booking-service");

const bookingService = new BookingService();

const createBooking = async (req, res) => {
  try {
    const { flightId, userId, noOfSeats } = req.body;
    const response = await bookingService.createBooking({
      flightId,
      userId,
      noOfSeats,
    });
    return res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      data: response,
      error: {},
    });
  } catch (error) {
    console.error("Error creating booking:", error); 

    return res.status(500).json({
      success: false,
      message: "Unable to create booking.",
      data: {},
      error: error.message || "An error occurred.",
    });
  }
};

const updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const updateData = req.body;
    const response = await bookingService.update(bookingId, updateData);
    return res.status(200).json({
      success: true,
      message: "Booking updated successfully.",
      data: response,
      error: {},
    });
  } catch (error) {
    console.error("Error updating booking:", error); // Log the error for debugging

    return res.status(500).json({
      success: false,
      message: "Unable to update booking.",
      data: {},
      error: error.message || "An error occurred.",
    });
  }
};

const getBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const response = await bookingService.getBooking(bookingId);
    return res.status(200).json({
      success: true,
      message: "Booking fetched successfully.",
      data: response,
      error: {},
    });
  } catch (error) {
    console.error("Error fetching booking:", error); // Log the error for debugging

    return res.status(500).json({
      success: false,
      message: "Unable to fetch booking.",
      data: {},
      error: error.message || "An error occurred.",
    });
  }
};


module.exports = {
  createBooking,
    updateBooking,
  getBooking
};
