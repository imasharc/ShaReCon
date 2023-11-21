const accountController = require('./accountController'); // Adjust the path as needed
const bcrypt = require('bcryptjs'); // For password hashing and comparison
const express = require('express')
const cookieParser = require('cookie-parser');
const app = express();
const { createTokens } = require('../utils/JWT')
const Account = require('../models/account')

app.use(express.json());
app.use(cookieParser());

const AuthController = {
    login: async (req: any, res: any) => {
        const { username, password } = req.body;
  
      try {
        // Check if the username exists
        const account = await accountController.loginByUsername(req.body.account.username);
  
        if (!account) {
          return res.status(401).json({ message: 'Invalid username or password' });
        }
  
        // Compare the provided password with the stored hashed password
        const passwordsMatch = await bcrypt.compare(req.body.account.password, account.password);
  
        if (passwordsMatch) {
            const accessToken = createTokens(req.body.account.username);
            Account.updateAccessToken(req.body.account.username, accessToken);

          // Authentication successful
          res.cookie('jwt', accessToken, { sameSite: 'None', httpOnly: false, maxAge: 24 * 60 * 60 * 1000 });
          return res.status(200).json({ auth: true, token: accessToken, result: account });
        } else {
          // Authentication failed
          return res.status(500).json({ auth: false, message: "no user exists" });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ auth: false, message: "no server response" });
      }
    },

    signup: async (req: any, res: any) => {
      const reqNew = {
          firstName: req.body.account.firstname,
          lastName: req.body.account.lastname,
          email: req.body.account.email,
          username: req.body.account.username,
          password: req.body.account.password,
        }
        console.log(req.body.account);

        const accessToken = createTokens(reqNew.username);

        try {
            // Create a new account, checking if the username is available
            const newAccount = await accountController.signup(reqNew.username, reqNew.firstName, reqNew.lastName, reqNew.email, reqNew.password, accessToken);

            if (newAccount && !newAccount.error) {
              res.cookie('jwt', accessToken, { sameSite: 'None', httpOnly: false, maxAge: 24 * 60 * 60 * 1000 });
              return res.status(201).json({ auth: true, token: accessToken, result: newAccount });
            } else if (newAccount && newAccount.error === 'Username is already taken') {
              res.status(400).json({ message: 'Username is already taken' });
            } else if (!reqNew.firstName || !reqNew.lastName || !reqNew.email || !reqNew.username || !reqNew.password) {
              res.status(400).json({ message: 'Field(s) are missing' });
            } else {
              res.status(500).json({ error: 'Internal server error' });
            }
          } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
        }
    },
  };
  
  module.exports = AuthController;
  