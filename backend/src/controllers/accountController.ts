const Account = require('../models/account');

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

    // Update an account by username
    updateByUsername: async (req: any, res: any) => {
        const { username } = req.params; // Get the original username from the route params
        // const { newUsername, firstName, lastName, email, password } = req.body.account; // Get the new account data from the request body
        const reqUpdates = {
            newUsername: req.body.account.username,
            firstName: req.body.account.firstname,
            lastName: req.body.account.lastname,
            email: req.body.account.email,
            password: req.body.account.password,
        }

        // Check if the newUsername is already taken
        const isUsernameTaken = await Account.getByUsername(reqUpdates.newUsername);
        const doesUsernameExist = await Account.getByUsername(username);

        if (!doesUsernameExist) {
            return res.status(400).json({ message: 'No such username' });
        } else if (isUsernameTaken) {
            return res.status(400).json({ message: 'Username is already taken' });
        } else if (!reqUpdates.newUsername || !reqUpdates.firstName || !reqUpdates.lastName || !reqUpdates.email || !reqUpdates.password) {
            return res.status(400).json({ message: 'Request fields cannot be null' });
        }

        // Proceed with the update if the newUsername is available
        const updatedAccount = await Account.updateByUsername(username, reqUpdates.newUsername, reqUpdates.firstName, reqUpdates.lastName, reqUpdates.email, reqUpdates.password);

        if (updatedAccount) {
            res.status(200).json({ message: 'Account updated successfully', account: updatedAccount });
        } else {
            res.status(404).json({ message: 'Account not found' });
        }
    }
};
