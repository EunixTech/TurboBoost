const { mongoURL, mainDbName } = require(`./connctionURL`);

module.exports = (mongoose) => {
  mongoose.set(`runValidators`, true); // to run validate operators on update operations too
  mongoose.set("strictQuery", true);

  const isDevMode = Boolean(
    process.env.MODE &&
    typeof process.env.MODE === `string` &&
    process.env.MODE.toLowerCase().trim() === `dev`
  );

  const mongoURLToUse = isDevMode ? mongoURL.dev : mongoURL.prod,
    dbToUse = isDevMode ? mainDbName.dev : mainDbName.prod;

  mongoose
    .connect(mongoURLToUse, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: dbToUse,
    })
    .then((data) => console.log(`[ ${dbToUse} ] DB Connected`))
    .catch((err) => {
      console.log(`err`, err);
      console.log(`DB Not Connected`);
    });
};
