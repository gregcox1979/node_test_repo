const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging');
require('./startup/errorLogging')();
require('./startup/configSettings')();
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/validation')();

winston.info('test!!!!!!');

//Test throwing an error
//throw new Error('Something went wrong ');

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    logger.info(`** Listening on port:${port} ***`);
});

module.exports = server;
