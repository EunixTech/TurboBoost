module.exports = {
    mongoURL: {
        prod: `mongodb://127.0.0.1:27017`,
        dev: process.env.MONGO_DB_URL
    },
    mainDbName: {
        prod: `TURBOBOOST-2023`,
        dev: `turboboost`
    }
}