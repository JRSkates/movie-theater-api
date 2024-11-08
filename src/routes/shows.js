const { Router } = require ('express');
const showsRouter = Router();
const User = require('../../models/user');
const Show = require('../../models/show');
const { check, validationResult } = require('express-validator');

showsRouter.get('/', async (req, res) => {
    if (req.query.genre) {
      const shows = await Show.findAll({ where: { genre: req.query.genre } })
      res.status(200).json(shows)
    } else {
      const shows = await Show.findAll()
      res.status(200).json(shows)
    }
})

showsRouter.get('/:id', async (req, res) => {
    const show = await Show.findByPk(req.params.id);
    if (!show) return res.status(404).json({ message: 'Show not found' });
    res.json(show);
})

showsRouter.get('/:id/users', async (req, res) => {
    const show = await Show.findByPk(req.params.id, { 
        include: { 
            model: User, 
            through: 'watched' 
        } 
    });

    if (!show || show.users.length === 0) {
        return res.status(404).json({ message: 'No users found for this show' });
    }

    res.json(show.users);
})

showsRouter.put('/:showId/available', async (req, res) => {
    const { showId } = req.params;

    const show = await Show.findByPk(showId);
    if (!show) return res.status(404).json({ message: 'Show not found' });

    show.available === false ? show.available = true : show.available = false;

    await show.save();
    const updatedShow = await Show.findByPk(showId);

    res.status(200).json({ message: `Show ${showId} availability updated successfully to ${updatedShow.available}`, updatedShow });
});

showsRouter.delete('/:id', async (req, res) => {
    const show = await Show.findByPk(req.params.id);
    if (!show) return res.status(404).json({ message: 'Show not found' });

    await show.destroy();
    res.status(200).json({ message: 'Show deleted successfully' });
});

module.exports = showsRouter;