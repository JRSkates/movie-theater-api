const { Router } = require ('express');
const showsRouter = Router();
const User = require('../../models/user');
const Show = require('../../models/show');
const { check, validationResult } = require('express-validator');

showsRouter.get('/', async (req, res) => {
    const shows = await Show.findAll();
    res.json(shows); 
})


module.exports = showsRouter;