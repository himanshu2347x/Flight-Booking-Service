const dotenv = require('dotenv');
dotenv.config();

module.exports={
    PORT: process.env.PORT,
    FLIGHT_SERVICE_PATH: process.env.FLIGHT_SERVICE_PATH,
    DB_SYNC:process.env.DB_SYNC
};