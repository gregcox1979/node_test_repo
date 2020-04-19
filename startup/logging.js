const winston = require('winston');

module.exports =  logger = winston.createLogger({
    //level: 'info',
    format: winston.format.simple(),
    //defaultMeta: { service: 'user-service' },
    transports: [
    new winston.transports.Console({colorize: true, prettyPrint: true, level: 'info' })
    ]
});