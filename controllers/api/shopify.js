require(`dotenv`).config({ path: `process.env` });

const express = require(`express`),
    crypto =  require("crypto"),
    winston =  require("winston"),
    cors = require('cors'),
    app = express();

app.use(cors());

app.get("/shopify-auth",(req,res)=>{

    console.log(`process.env.SHOPIFY_API_KEY`,process.env.SHOPIFY_API_KEY)
    try {

        const { ['hmac']: hmac, ...queryData } = req.query
        const shop = queryData.shop
        const host = queryData.host
        const timestamp = queryData.timestamp
        if (!shop || !hmac || !host || !timestamp) {
          res.status(401).json({ message: "unauthorized access", err: "query parameter is missing" })
          return
        }
        let keys = Object.keys(queryData)
        let message = ''
        for (let x of keys) {
          message += `&${x}=${queryData[x]}` //remove hmac from query string and forming new query string from hmac check
        }
        message = message.slice(1, message.length)
    
        console.log("message", message)
        const generatedHash = crypto.createHmac('SHA256', process.env.SHOPIFY_API_SECRET).update(message, 'utf8').digest('hex');
        if (generatedHash != hmac) { // security check for hmac
          res.status(401).json({ message: "unauthorized access", err: "Invalid hmac" })
          return
        }
    
        /// Security verification
    
    
        // const state = new OauthState({
        //   key: nanoid(),
        //   data: {
        //     login: true,
        //     hmac: hmac,
        //     queryData: queryData,
    
        //   },
        // });
    
        // await state.save();
        var uri = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${process.env.SHOPIFY_API_SCOPES}&state="test"&redirect_uri=${process.env.SHOPIFY_API_REDIRECT}`
        res.redirect(uri);
    
      } catch (err) {
        console.log(err)
        // winston.error(`${err}`);
        res.status(400).send({ message: `HVSHJZX` });
      }
})


app.get(`/redirect`,async(req,res)=>{
    // console.log(req.query)

    try {
        winston.info({
          Event: "Shopify Auth Callback",
          query: { ...req.query },
        });
        const { shop, code, state: user_token, timestamp, host, hmac } = req.query;
        if (!shop || !hmac || !host || !timestamp || !user_token || !code) {
          res.status(401).json({ error: "unauthorized access" })
          return
        }
        const message = `code=${code}&host=${host}&shop=${shop}&state=${user_token}&timestamp=${timestamp}`
        const generatedHash = crypto.createHmac('SHA256', process.env.SHOPIFY_API_SECRET).update(message, 'utf8').digest('hex');
        if (generatedHash != hmac) { //Security checks for hmac
          res.status(401).json({ error: "unauthorized access" })
          return
        }
        var regexp1 = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9\-]*.myshopify.com/); // Security checks for shop
        if (!regexp1.test(shop)) {
          res.status(401).json({ error: "Invalid shop" })
          return
        }
    
        const oauthState = await OauthState.findOne({ key: user_token });
        if (!oauthState) {
          res.redirect(`${process.env.FRONTEND_URL}/login`);
          return;
        }
        await OauthState.deleteOne({ _id: oauthState._id });
    
        /// api verification ends here ////////
    
        const config = { //Request for access token
          method: 'POST',
          url: `https://${shop}/admin/oauth/access_token`,
          data: {
            code: req.query.code,
            client_id: SHOPIFY_API_KEY,
            client_secret: SHOPIFY_API_SECRET,
          },
        };
        const response = await Axios(config);
        const data = response.data
        const connectData = {
          ...req.query,
          tokenData: {
            ...data,
          },
        };
        console.log("datadatadata----------=-=-=-=-=-=-=-=-=-=", data)
        let shopData = await ShopifyService.getShopDetails(shop, data.access_token)
        const email=shopData?.shop?.email
        let name=shopData?.shop?.shop_owner
        const first_name=name.split(' ')[0]
        const last_name=name.split(' ')[1]
        // const { email, first_name, last_name } = response.data.associated_user;
        let scopes = data.scope
        let webhook = await this.createUninstallWebHook(shop, data.access_token) //create webhook function
        if (!scopes.includes('write_orders')) { ////Security checks for scopes
          res.status(401).json({ error: "unauthorized access" })
          return
        }
        const integration = await Integration.findOne({
          backendUrlPrefix: "shopify",
        });
    
        var auth_token
        var newAdmin
        let timeZoneObject = {}
        const integrationId = integration.id;
        const connection = await Connection.find({ "connectData.shop": shop, "integrationId": integrationId, isDeleted: { $exists: true } });
        console.log(connection)
        if (isNull(connection) || connection.length === 0) { // checking for user exist or not
          console.log("new")
          let userId
          let userData=await User.findOne({email:email})
          console.log(userData,"old")
    
          if(userData&&Object.keys(userData).length>0){
            userId=userData.id
          }else{
            const user = new User({
              firstName: first_name,
              lastName: last_name,
              email: email,
              registerFrom: "shopify"
            });
            newAdmin = await user.save();
            console.log(newAdmin,"new")
    
            userId=newAdmin._id
            //create new user
            publishEvent({
              channel: "new-trial",
              event: "New Trial | New user installed app",
              icon: "🌱",
              description: `New user installed app from shopify`,
              email: email,
              name:`${first_name} ${last_name}`,
              date:`${moment().format("YYYY-MM-DD HH:mm")}`
            });
          }
          auth_token = jwt.sign(
            {
              id: userId,
            },
            process.env.AUTH_JWT_SECRET_KEY,
            { expiresIn: CONFIG.AUTH_JWT_EXPIRED }
          );
          timeZoneObject.userId = userId
    
          const newConnection = new Connection({
            integrationId,
            userId: userId,
            connectData,
          });
    
        
    
          await newConnection.save(); // creating new connection
          let list = []
          let order = 0
          for (let x of integration.metrics) {
            list.push({
              integrationId: integration._id,
              metricCode: x.code,
              metricData: {},
              order: order
            })
            order++
          }
          console.log(list)
          const stack = new Stack({
            userId: userId,
            name: 'My First Stack',
            icon: "🌱",
            list,
          });
          const newStack = await stack.save(); // creating user's first stack
        } else {
          console.log("old")
          // user already exist
          let userId = connection[0].userId
          auth_token = jwt.sign(
            {
              id: userId,
            },
            process.env.AUTH_JWT_SECRET_KEY,
            { expiresIn: CONFIG.AUTH_JWT_EXPIRED }
          );
          timeZoneObject.userId = userId
          await Connection.findByIdAndUpdate(connection[0]._id, { connectData, isDeleted: false });
          let stackData = await Stack.find({ userId: userId })
          console.log(stackData, "stackData")
          if (!stackData || stackData?.length < 1) {
            let list = []
            let order = 0
            for (let x of integration.metrics) {
              list.push({
                integrationId: integration._id,
                metricCode: x.code,
                metricData: {},
                order: order
              })
              order++
            }
            const stack = new Stack({
              userId: userId,
              name: 'My First Stack',
              icon: "🌱",
              list,
            });
            const newStack = await stack.save(); // creating user's first stack
            
          }
          // let updateTimeZone = await User.findByIdAndUpdate(timeZoneObject.userId, { featureJourney: 0 })
        }
        if (shopData?.shop?.iana_timezone && timeZoneObject.userId) {
          console.log("updating")
          let updateTimeZone = await User.findByIdAndUpdate(timeZoneObject.userId, { iana_timezone: shopData?.shop?.iana_timezon })
        }
    
        res.redirect(`${process.env.FRONTEND_URL}/?t=${auth_token}`);
      } catch (err) {
        winston.error(`${err}`);
        res.status(400).send({ message: `${err || COMMON_ERROR.SERVER_ERROR}` });
      }

})



app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ error: 'seriously something went wrong ' });
});


// Server setup
app.listen(process.env.PORT, () => console.log(`[ Turbo Boost ] on ${process.env.PORT}`));