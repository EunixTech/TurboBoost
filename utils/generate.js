const jwt = require(`jsonwebtoken`),
    bcrypt = require(`bcryptjs`);

const tokenSecret = process.env.JWT_SECRET;

exports.generateJWT = (id, entity) => {
    return jwt.sign({ id, entity }, tokenSecret);
}

exports.verifyAndDecodeToken = (token) => {
    return jwt.verify(token, tokenSecret);
}

exports.hashPassword = (password = null, saltRounds = 10) => {

    const parsedSaltRounds = Number(saltRounds);
    if (isNaN(parsedSaltRounds) || (parsedSaltRounds < 1)) {
        throw new TypeError(`Salt round count must be a valid positive integer`);
    }

    const hash = bcrypt.hashSync(password, parsedSaltRounds);
    return hash;
}

