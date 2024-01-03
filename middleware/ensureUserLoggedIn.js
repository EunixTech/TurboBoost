const mongoose = require(`mongoose`),
    User = mongoose.model("user"),
    { verifyAndDecodeToken } = require(`../utils/generate`),
    jwt = require('jsonwebtoken');

exports.ensureUserLoggedIn = async (req, res, next) => {
   
    try {

        let token = null;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        console.log("token", token)


        if (!token) return res.json({
            status: 403,
            message: `InvalidToken`,
        
        })
        else {

            const decodedPayload = verifyAndDecodeToken(token);

            if (!((decodedPayload && decodedPayload.userId))) {
                return res.json({
                    status: 403,
                    message: `unauthorized`,
                })
            } else {

                userId = decodedPayload.userId.trim();

                const dbQuery = {
                    _id: userId
                };

                const user = await User.findOne(dbQuery);
            
                if (!user) return res.status(401).json({
                    status: 404,
                    message: `User  not found`
                });

                req.userId = user._id;
                req.accessToken = user?.app_token?.shopify?.access_token;
            }

        }

        return next();
    } catch (err) {
       console.log(err)
        res.json({
            status: 403,
            message: `InvalidToken`,

        })
    }

}

function verifyqJWT(token) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            return err;
        } else {
            return decoded.userId;
        }
    });
}
