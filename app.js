const express = require("express");
const cors = require('cors')
const app = express();
const bodyParser = require("body-parser");


const userRoutes = require('./routes/users')
const filmRoutes = require('./routes/films')

require('./db/connection')

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    msg: "films "
  });
});

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/films', filmRoutes)

module.exports = app;