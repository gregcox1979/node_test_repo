const auth = require('../middleware/auth');
const {Customer, validate} = require('../models/customer');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers); 
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    
        if (!customer) return res.status(404).send('Customer not found');
    res.send(customer);
})

router.post('/', auth, async (req,res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const existing_customer= await Customer
        .find({name:req.body.name})
        .countDocuments()
    if (existing_customer > 0) return res.status(400).send('Customer already exists');

    let customer = new Customer({
         isGold: req.body.isGold
        ,name: req.body.name 
        ,phone: req.body.phone
    });

    try {
        customer = await customer.save();
    }
    catch(ex) {
        return res.status(404).send(ex);
    }

    res.send(customer)
})

router.put('/:id', async (req,res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findByIdAndUpdate(req.params.id, {name:req.body.name}, {
        new: true
    });
    if (!customer) return res.status(404).send('Cannot find Customer to update');

    res.send(customer);
})

router.delete('/:id', async (req,res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('Cannot find Customer to delete');
    
    res.send(customer);
})

module.exports = router;
