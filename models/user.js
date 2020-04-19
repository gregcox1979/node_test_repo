const jwt = require('jsonwebtoken');
const config = require('config');
var Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String
       ,minlength: 5
       ,maxlength: 50
       ,trim: true
       ,required:true 
    } 
    ,email: {
        type: String
       ,minlength: 5
       ,maxlength: 255
       ,trim: true
       ,unique: true
       ,required:true 
    }  
    ,password: {
        type: String
       ,minlength: 5
       ,maxlength: 1024
       ,trim: true
       ,required:true 
    }
    ,isAdmin: Boolean   
});

userSchema.methods.generateAuthToken = function() {
    //console.log(`_id:${this._id}, isAdmin:${this.isAdmin}`);
    const token = jwt.sign({_id:this._id, isAdmin:this.isAdmin}, config.get('jwtPrivateKey')); 
    return token;
}

const User = mongoose.model('User',userSchema);

function validate(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required()
       ,email: Joi.string().min(5).max(255).required().email()
       ,password: Joi.string().min(5).max(1024).required()
    };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validate;