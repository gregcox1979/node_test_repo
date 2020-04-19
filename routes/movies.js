const auth = require('../middleware/auth');
const {Movie, validate} = require('../models/movie')
const {Genre} = require ('../models/genre')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.get('/', async (req, res) => {
    logger.info("Getting Movies");
    const movies = await Movie.find().sort('title');
    res.send(movies); 
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) return res.status(404).send('Movie not found');
    res.send(movie);
})

router.post('/', auth, async (req,res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const existing_movie = await Movie
        .find({title:req.body.title})
        .countDocuments()
    if (existing_movie > 0) return res.status(400).send('Movie already exists');

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre'); 

    const movie = new Movie({
        title: req.body.title
       ,genre: {
           _id: genre.id
          ,name: genre.name 
       }
       ,numberInStock: req.body.numberInStock
       ,dailyRentalRate: req.body.dailyRentalRate
    });

    try {
        await movie.save();
    }
    catch(ex) {
        return res.status(404).send(ex);
    }

    res.send(movie)
})

router.put('/:id', auth, async (req,res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Invalid genre'); 

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title:req.body.title
       ,genre:{
           _id:genre.id
          ,name: genre.name 
       }
       ,numberInStock: req.body.numberInStock
       ,dailyRentalRate: req.body.dailyRentalRate
    }, {
        new: true
    });
    if (!movie) return res.status(404).send('Cannot find Movie to update');

    res.send(movie);
})

router.delete('/:id', auth, async (req,res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send('Cannot find Movie to delete');
    
    res.send(movie);
})

module.exports = router;
