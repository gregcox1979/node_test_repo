const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function() {
    const db = config.get('db');
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useCreateIndex', true);
    mongoose.connect(db,{
        useNewUrlParser: true
        })
    .then(()=> logger.info(`Connected to ${db}`)); 
}