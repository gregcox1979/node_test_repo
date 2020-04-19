//const asyncMiddleware = require('../middleware/async');
const validate = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Genre, validateReturn} = require('../models/genre') 
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// router.get('/', asyncMiddleware(async (req, res) => {
//     const genres = await Genre.find().sort('name');
//     res.send(genres); 
// }));

router.get('/', async (req, res) => {
    logger.info('Getting Genres');
    //throw new Error ('could not get the genres');
    const genres = await Genre.find().sort('name');
    res.send(genres); 
});

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    
    if (!genre) return res.status(404).send('Genre not found');
    res.send(genre);
})

router.post('/', [auth,validate(validateReturn)], async (req,res) => {

    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    // REPLACED WITH middleware "validate(validateReturn)" ref above:

    const existing_genre = await Genre
        .find({name:req.body.name})
        .countDocuments()
    if (existing_genre > 0) return res.status(400).send('Genre already exists');

    let genre = new Genre({
        name: req.body.name
    });

    genre = await genre.save();

    res.send(genre)
})

router.put('/:id', [auth,validate(validateReturn)], async (req,res) => { 
    // const { error } = validateReturn(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    // REPLACED WITH middleware "validate(validateReturn)" ref above:

    const genre = await Genre.findByIdAndUpdate(req.params.id, {name:req.body.name}, {
        new: true
    });
    if (!genre) return res.status(404).send('Cannot find Genre to update');

    res.send(genre);
})

router.delete('/:id', [auth, admin], async (req,res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('Cannot find Genre to delete');
    
    res.send(genre);
})

module.exports = router;
