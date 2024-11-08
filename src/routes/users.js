const { Router } = require ('express');
const usersRouter = Router();
const User = require('../../models/user');
const Show = require('../../models/show');
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

usersRouter.get('/:id/shows', async (req, res) => {
    const user = await User.findByPk(req.params.id, { 
        include: { 
            model: Show, 
            through: 'watched' 
        } 
    });

    if (!user || user.shows.length === 0) {
        return res.status(404).json({ message: 'No shows found for this user' });
    }

    res.json(user.shows);
})

usersRouter.put('/:id/shows/:showId', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const show = await Show.findByPk(req.params.showId);
    if (!show) return res.status(404).json({ message: 'Show not found' });
    
    await user.addShow(show);
    res.json({ message: 'Show added to user' });
})

module.exports = usersRouter;