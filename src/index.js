const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const{DB_SYNC}=require('./config/serverConfig')

const {PORT} = require('./config/serverConfig');
const apiRoutes = require('./routes/index');
const db = require('./models');

const setupAndStartServer = () => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api', apiRoutes);

    app.listen(PORT, () => {
        console.log(`Server started on PORT ${PORT}`);

    });
}

setupAndStartServer();