require(`dotenv`).config({ path: `process.env` });

const express = require(`express`),
    cors = require('cors'),
    helmet = require("helmet"),
    mongoose = require("mongoose"),
    expressSession = require(`express-session`),
    MongoStore = require(`connect-mongo`),
    app = express();


const dbConnection = require('./config/dbConnection'),
    loadHelmet = require(`./loaders/helmets`),
    loadExpressSession = require(`./loaders/expressSession`);

dbConnection(mongoose);

require("./model/apps/outhState");
require("./model/users");

loadHelmet(app, helmet);
loadExpressSession(app, expressSession, MongoStore);

// body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));



app.use(cors());



const allRoutes = require("./routes/all");
app.use(allRoutes)




// app.use((err, req, res) => {
//     console.log(err)
//     res.status(500).send({ error: 'seriously something went wrong ' });
// });

// Server setup
app.listen(process.env.PORT, () => console.log(`[ Turbo Boost ] on ${process.env.PORT}`));