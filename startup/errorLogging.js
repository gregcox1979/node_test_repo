const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
    // process.on('uncaughtException', (ex) => {
    //     console.log('UNCAUGHT EXCEPTION');  
    //     winston.error(ex.message);
    // });

    // winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    // winston.add(new winston.transports.MongoDB({db:'mongodb://localhost/vidly'}));

    // Replaced WITH:

    winston.exceptions.handle(
        new winston.transports.Console({colorize: true, prettyPrint: true})
       ,new winston.transports.File({filename: 'uncaughtExceptions.log'})
       ,new winston.transports.MongoDB({db:'mongodb://localhost/vidly'})
   );
   
   process.on('unhandledRejection', (ex) => {
       console.log(ex);
       throw ex;
   });    
}