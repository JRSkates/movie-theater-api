const express = require("express");
const app = express();
const usersRouter = require('./routes/users.js')

app.use(express.json());
app.use(express.urlencoded());
app.use('/users', usersRouter);

module.exports = app;