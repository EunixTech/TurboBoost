/* eslint-disable no-undef */
require(`dotenv`).config({ path: `process.env` });

const express = require(`express`),
    cors = require('cors'),
    Queue = require('bull'),
    helmet = require("helmet"),
    mongoose = require("mongoose"),
    expressSession = require(`express-session`),
    MongoStore = require(`connect-mongo`),
    app = express();

    var morgan = require('morgan')

// Create / Connect to a named work queue
const workQueue = new Queue('critical-css', process.env.REDIS_URL, { redis: { 
	tls: { rejectUnauthorized: false }
}});

const dbConnection = require('./config/dbConnection'),
    loadHelmet = require(`./loaders/helmets`),
    loadExpressSession = require(`./loaders/expressSession`);

dbConnection(mongoose);

require("./model/outhState");
require("./model/users");
require("./model/productImages");
require("./model/subscription");
require("./model/OTP");

loadHelmet(app, helmet);
loadExpressSession(app, expressSession, MongoStore);

// body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// setup the logger
app.use(morgan('combined'))
app.use(cors());


app.post('/customers/redact', (req, res, next) => {
    // No customeer or shop data is stored, so we only log the request
    console.log('new /customers/redact request with data');
    req.body = "Request received successfully"
});

app.post('/shop/redact', (req, res, next) => {
    // No customeer or shop data is stored, so we only log the request
    console.log('new /shop/redact request with data');
    req.body = "Request received successfully"
});
app.post('/customers/data-request', (req, res, next) => {
    // No customeer or shop data is stored, so we only log the request
    console.log('new /customers/data-request request with data');
    req.body = "Request received successfully"
});

const allRoutes = require("./routes/all");
app.use(allRoutes)

// app.use((err, req, res) => {
//     return res.status(500).send({ error: 'seriously something went wrong ' });
// });


// You can listen to global events to get notified when jobs are processed
workQueue.on('global:completed', async (jobId, result) => {
    let job = await workQueue.getJob(jobId);
    if (job !== null) {
        job.update({
            ...job.data,
            result: result
        });
    }
});

// Server setup
app.listen(process.env.PORT, () => console.log(`[ Turbo Boost ] on ${process.env.PORT}`));