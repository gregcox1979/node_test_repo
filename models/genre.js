var Joi = require('joi');
const mongoose = require('mongoose');

// const Genre = mongoose.model('Genre',new mongoose.Schema({
//     name: {
//         type: String
//        ,minlength:5
//        ,maxLength:50
//        ,required:true 
//     }  
// }));

const genreSchema = new mongoose.Schema({ 
    name: {
        type: String
       ,minlength:5
       ,maxlength:50
       ,required:true 
    }  
});

const Genre = mongoose.model('Genre', genreSchema)

function validateReturn(genre) {
    const schema = {
        name: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(genre, schema);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateReturn = validateReturn;