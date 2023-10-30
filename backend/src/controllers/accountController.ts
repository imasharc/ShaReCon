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
};
