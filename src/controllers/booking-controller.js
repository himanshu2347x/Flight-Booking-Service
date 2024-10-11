const { REMINDER_BINDING_KEY } = require("../config/serverConfig");
const BookingService = require("../services/booking-service");
const { createChannel, publishMessage } = require("../utils/messageQueue");

const bookingService = new BookingService();

class BookingController {
  constructor() {
    
  }
  async sendMessageToQueue(req,res) {
    const channel = await createChannel();
    const data = {
      message:'Success'
    }
    publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(data));
    return res.status(200).json({
      message:"successfully published the event"
    })
  }
  async createBooking(req, res) {
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

  async updateBooking (req, res) {
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
    return res.status(500).json({
      success: false,
      message: "Unable to update booking.",
      data: {},
      error: error.message || "An error occurred.",
    });
  }
};

async getBooking (req, res) {
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
    return res.status(500).json({
      success: false,
      message: "Unable to fetch booking.",
      data: {},
      error: error.message || "An error occurred.",
    });
  }
};
};

module.exports = BookingController;
