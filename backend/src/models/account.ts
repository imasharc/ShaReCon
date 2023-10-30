const pool = require('../db');

const Account = {
    // properties
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',

    // Method to retrieve an account by username
    getByUsername: async (username: string) => {
        try {
            const query = {
                text: 'SELECT * FROM account WHERE username = $1',
                values: [username],
            };

            const data = await pool.query(query);

            if (data.rows.length > 0) {
                // Return the first matching account as a JSON object
                return data.rows[0];
            } else {
                // If no matching account is found, return null
                return null;
            }
        } catch (err) {
            // Handle any errors that occur during the database query
            console.error('Error in getByUsername:', err);
            throw err;
        }
    }
};

module.exports = Account;