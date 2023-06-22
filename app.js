
require(`dotenv`).config({ path: `process.env` });

const express = require(`express`),
    cors = require('cors'),
    mongoose = require("mongoose"),
    app = express();


const dbConnection = require('./config/dbConnection');
dbConnection(mongoose)

app.use(cors());

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ error: 'seriously something went wrong ' });
});

// Server setup
app.listen(process.env.PORT, () => console.log(`[ Turbo Boost ] on ${process.env.PORT}`));