﻿const { sign, verify } = require('jsonwebtoken');
const account = require('../models/account')
import * as dotenv from 'dotenv'
dotenv.config()

const createTokens = (username: any) => {
    const accessToken = sign(
        { user_id: username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2h" }
    );
    
        return accessToken;
};

const validateToken = (req: any, res: any, next: any) => {
    const accessToken = req.cookies['jwt'];
    console.log(accessToken);
    console.log(req.headers);

    if (!accessToken) {
        return res.status(400).json({ error: "User Not Authenticated "});
    }

    try {
        const validToken = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        
        if (validToken) {
            req.authenticated = true;
            return next();
        }
    } catch (err) {
        return res.status(400).json({ error: err });
    }
}

module.exports = { validateToken, createTokens };