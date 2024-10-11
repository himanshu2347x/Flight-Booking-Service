const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  FLIGHT_SERVICE_PATH: process.env.FLIGHT_SERVICE_PATH,
  DB_SYNC: process.env.DB_SYNC,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  REMINDER_BINDING_KEY: process.env.REMINDER_BINDING_KEY,
  MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
};
