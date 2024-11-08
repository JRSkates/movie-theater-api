const express = require("express");
const app = express();
const usersRouter = require('./routes/users.js')
const showsRouter = require('./routes/shows.js')

app.use(express.json());
app.use(express.urlencoded());
app.use('/users', usersRouter);
app.use('/shows', showsRouter);

module.exports = app;