const axios = require("axios");
const BookingRepository = require("../repository/booking-repository");
const { FLIGHT_SERVICE_PATH } = require("../config/serverConfig");
const { ServiceError, ValidationError, AppError } = require("../utils");
const { StatusCodes } = require("http-status-codes");

class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async createBooking(data) {
    try {
      const flightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${data.flightId}`;
      console.log("fetching flight details with url ", flightRequestUrl);
      const flightResponse = await axios.get(flightRequestUrl);
      if (!flightResponse) {
        throw new ServiceError(
          "Flight Not Found",
          "The requested flight was not found."
        );
      }
      const requestedflightDetails = flightResponse.data.data;
      console.log("flight details are", requestedflightDetails);
      const totalAvailableSeats = requestedflightDetails.totalSeats;
      console.log("total setas are ", totalAvailableSeats);
      const seatsToBeBooked = data.noOfSeats;

      if (totalAvailableSeats < seatsToBeBooked) {
        throw new ServiceError(
          "Insufficient Seats",
          "There are not enough seats available for booking."
        );
      }
      const flightPrice = requestedflightDetails.price;
      const totalCost = flightPrice * seatsToBeBooked;

      const bookingPayload = { ...data, totalCost };
      const booking = await this.bookingRepository.create(bookingPayload);

      const updateFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${data.flightId}`;
      await axios.patch(updateFlightRequestUrl, {
        totalSeats: totalAvailableSeats - seatsToBeBooked,
      });

      const finalBooking = await this.bookingRepository.update(booking.id, {
        status: "Booked",
      });

      return finalBooking;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AppError) {
        throw error;
      }
      throw new ServiceError(
        "Service Error",
        "An error occurred while creating the booking."
      );
    }
  }

  async getBooking(bookingId) {
    try {
      const result = await this.bookingRepository.getBooking(bookingId);
      return result;
    } catch (error) {
      throw new ServiceError(
        "Service Error",
        "An error occurred while retrieving the booking."
      );
    }
  }

  async update(bookingId, data) {
    try {
      const existingBooking = await this.bookingRepository.getBooking(
        bookingId
      );
      if (!existingBooking) {
        throw new ServiceError(
          "Booking Not Found",
          `No booking found with ID ${bookingId}`,
          StatusCodes.NOT_FOUND
        );
      }

      // Example additional logic: Check if the booking status allows updates
      if (existingBooking.status === "Cancelled") {
        throw new ServiceError(
          "Invalid Operation",
          "Cannot update a cancelled booking.",
          StatusCodes.BAD_REQUEST
        );
      }

      const updatedBooking = await this.bookingRepository.update(
        bookingId,
        data
      );

      if (data.status === "Cancelled") {
        const updateFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${existingBooking.flightId}`;
        await axios.patch(updateFlightRequestUrl, {
          totalSeats: existingBooking.totalSeats + existingBooking.noofSeats,
        });
      }

      return updatedBooking;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AppError) {
        throw error; // Re-throw known errors
      }
      throw new ServiceError(
        "Service Error",
        "An error occurred while updating the booking."
      );
    }
  }
}

module.exports = BookingService;
