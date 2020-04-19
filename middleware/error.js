const winston = require('winston');

module.exports = function(err, req, res, next) {
    //console.log(err.message, err);
    logger.error(err.message, err);
    res.status(500).send('Something failed:');
}

// module.exports = function(err, req, next) {
//     res.status(500).send('Something failed:');
// }
