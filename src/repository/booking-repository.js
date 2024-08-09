const { ValidationError, AppError, ServiceError } = require("../utils/index");
const { Booking } = require("../models/index");
const { StatusCodes } = require("http-status-codes");

class BookingRepository {
  async create(data) {
      try {
          console.log("upcoming data in repo is ",data);
          const result = await Booking.create(data);
          console.log(result);
      return result;
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        throw new ValidationError(error);
      }
      throw new AppError(
        "Repository Error",
        "Cannot Create Booking",
        "There was some issue creating the booking. Please try again later.",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBooking(bookingId) {
    try {
      const result = await Booking.findByPk(bookingId);
      if (!result) {
        throw new AppError(
          "Repository Error",
          "Booking Not Found",
          "No booking found with the given ID.",
          StatusCodes.NOT_FOUND
        );
      }
      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error; // Re-throw known AppError
      }
      throw new AppError(
        "Repository Error",
        "Unable to get Booking",
        "There was an issue retrieving the booking. Please try again later.",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(bookingId, data) {
    try {
      const booking = await Booking.findByPk(bookingId);
      if (!booking) {
        throw new AppError(
          "Repository Error",
          "Booking Not Found",
          "No booking found with the given ID.",
          StatusCodes.NOT_FOUND
        );
      }
      Object.assign(booking, data);
      await booking.save();
      return booking;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error.name === "SequelizeValidationError") {
        throw new ValidationError(error);
      }
      throw new AppError(
        "Repository Error",
        "Cannot Update Booking",
        "There was an issue updating the booking. Please try again later.",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = BookingRepository;
