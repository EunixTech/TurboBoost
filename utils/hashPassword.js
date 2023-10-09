const bcrypt = require('bcrypt');

const hashPassword =  async(password) => {
    try {

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash the password using the generated salt
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;

    } catch (error) {
        throw error;
    }

}

module.exports = hashPassword

