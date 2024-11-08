const { Router } = require ('express');
const usersRouter = Router();
const User = require('../../models/user');
const { check, validationResult } = require('express-validator');

usersRouter.get('/', async (req, res) => {
    const users = await User.findAll();
    res.json(users); 
})

usersRouter.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
})

module.exports = usersRouter;