const { sign, verify } = require('jsonwebtoken');
const account = require('../models/account')
import * as dotenv from 'dotenv'
dotenv.config()

const createTokens = (account: any) => {
    const accessToken = sign(
        { username: account.username, id: account.id },
        process.env.ACCESS_TOKEN_SECRET
        );

        return accessToken;
};

module.exports = createTokens;