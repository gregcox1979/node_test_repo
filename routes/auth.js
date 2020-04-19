const {User} = require('../models/user')
var Joi = require('joi');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/', async (req,res) => {
    console.log(req.body);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({email:req.body.email})
    if (!user) return res.status(400).send('Invalid email or password');

    const isValidUser = await bcrypt.compare(req.body.password,user.password);
    if (!isValidUser) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken(); 
    res.send(token);
})

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email()
       ,password: Joi.string().min(5).max(1024).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;
