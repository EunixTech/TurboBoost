const mongoose = require(`mongoose`),
    User = mongoose.model("user"),
    { verifyAndDecodeToken } = require(`../utils/generate`),
    jwt = require('jsonwebtoken');

exports.ensureUserLoggedIn = async (req, res, next) => {
    console.log("working111")
    try {

        let token = null;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

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
                    // "userInfo.status": 1, //checking if user is active or not
                    _id: userId
                };

                const user = await User.findOne(dbQuery);

                if (!user) return res.status(401).json({
                    status: 404,
                    message: `User  not found`
                });
                req.userId = user._id;
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
