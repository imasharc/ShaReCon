const Account = require('../models/account');

module.exports = {
    // Get Account by username
    getByUsername: async (req: any, res: any) {
        const { username } = req.params; // Use req.params to get the username from the route params

        await Account.getByUsername(username)
            .then((data: any) => {
                if (data) {
                    res.status(200).json({ account: data });
                } else {
                    res.status(404).json({ message: 'Account not found' });
                }
            })
            .catch((err: any) => {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
            });
    }
};
