const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const {User, validate} = require('../models/user')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');

// router.get('/', async (req, res) => {
//     const users = await User.find().sort('title');
//     res.send(users); 
// });

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) return res.status(404).send('User not found');
    res.send(user);
})

router.post('/', auth, async (req,res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const existing_user = await User
        .find({email:req.body.email})
        .countDocuments()
    if (existing_user > 0) return res.status(400).send('User already exists');

    const user = new User(_.pick(req.body,['name','email','password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt)

    try {
        await user.save();
        const token = user.generateAuthToken();   
        res.header('x-auth-token', token).send(_.pick(user, ['_id','name', 'email']));
    }
    catch(ex) {
        return res.status(404).send(ex);
    }
})

router.put('/:id', auth, async (req,res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name
       ,email: req.body.email
       ,password: req.body.password
    }, {
        new: true
    });
    if (!user) return res.status(404).send('Cannot find User to update');

    res.send(movie);
})

router.delete('/:id', auth, async (req,res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send('Cannot find User to delete');
    
    res.send(user);
})

module.exports = router;
