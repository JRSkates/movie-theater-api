const { Router } = require ('express');
const usersRouter = Router();
const User = require('../../models/user');
const { check, validationResult } = require('express-validator');

usersRouter.get('/', async (req, res) => {
    const users = await User.findAll();
    res.json(users); 
})

module.exports = usersRouter;