﻿const Account = require('../models/account');

module.exports = {
        // Get all accounts
        getAllAccounts: async (req: any, res: any) => {
            try {
                const accounts = await Account.getAllAccounts();
    
                res.status(200).json({ accounts });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
            }
        },

    // Get Account by username
    getByUsername: async (req: any, res: any) => {
        const { username } = req.params; // Use req.params to get the username from the route params

        try {
            const data = await Account.getByUsername(username);

            if (data) {
                res.status(200).json({ account: data });
            } else {
                res.status(404).json({ message: 'Account not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    createNew: async (req: any, res: any) => {
        // const { username, firstName, lastName, email, password } = req.body
        const reqNew = {
            username: req.body.account.username,
            firstName: req.body.account.firstname,
            lastName: req.body.account.lastname,
            email: req.body.account.email,
            password: req.body.account.password,
        }

        try {
            // Create a new account, checking if the username is available
            const newAccount = await Account.createNew(reqNew.username, reqNew.firstName, reqNew.lastName, reqNew.email, reqNew.password);

            if (newAccount && !newAccount.error) {
                res.status(201).json({ message: 'Account created successfully', account: newAccount });
            } else if (newAccount && newAccount.error === 'Username is already taken') {
                res.status(400).json({ message: 'Username is already taken' });
            } else if (!reqNew.username || !reqNew.firstName || !reqNew.lastName || !reqNew.email || !reqNew.password) {
                res.status(400).json({ message: 'Field(s) are missing' });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Update an account by username
    updateByUsername: async (req: any, res: any) => {
        const { username } = req.params; // Get the original username from the route params
        const reqUpdates = {
            newUsername: req.body.account.username || null,
            firstName: req.body.account.firstname || null,
            lastName: req.body.account.lastname || null,
            email: req.body.account.email || null,
            password: req.body.account.password || null,
        }

        // Check if the newUsername is already taken
        const isUsernameTaken = await Account.getByUsername(reqUpdates.newUsername);
        const doesUsernameExist = await Account.getByUsername(username);

        if (!doesUsernameExist) {
            return res.status(400).json({ message: 'No such username' });
        } else if (isUsernameTaken) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Proceed with the update if the newUsername is available
        const updatedAccount = await Account.updateByUsername(username, reqUpdates.newUsername, reqUpdates.firstName, reqUpdates.lastName, reqUpdates.email, reqUpdates.password);

        if (updatedAccount) {
            res.status(200).json({ message: 'Account updated successfully', account: updatedAccount });
        } else {
            res.status(404).json({ message: 'Account not found' });
        }
    },

    // Delete an account by username and paasword
    deleteByUsernameAndPassword: async (req: any, res: any) => {
        const { username } = req.params; // Get the username from the route params
        const password = req.body.account.password; // Get the password from the request body

        try {
            // Call the model method to delete the account by username and password
            console.log(password);
            const result = await Account.deleteByUsernameAndPassword(username, password);

            if (result) {
                // Account was deleted successfully or password was correct
                res.status(200).json(result);
            } else {
                // Account not found or password incorrect
                res.status(404).json({ message: 'Account not found or password incorrect' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};
