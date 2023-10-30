const pool = require('../db');
const bcryptjs = require('bcryptjs');

const Account = {
    // properties
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',

    // Method to retrieve all accounts
    getAllAccounts: async () => {
        try {
            const query = 'SELECT * FROM account';
            const data = await pool.query(query);

            return data.rows;
        } catch (err) {
            // Handle any errors that occur during the database query
            console.error('Error in getAllAccounts:', err);
            throw err;
        }
    },

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
    },

    updateByUsername: async (username: string, newUsername: string, firstName: string, lastName: string, email: string, password: string) => {
        try {
            const hashedPassword = await bcryptjs.hash(password, 10);

            const query = {
                text: `UPDATE account
                    SET username = $2, firstname = $3, lastname = $4, email = $5, password = $6
                    WHERE username = $1
                    RETURNING *`,
                values: [username, newUsername, firstName, lastName, email, hashedPassword],
            };

            const data = await pool.query(query);

            if (data.rows.length > 0) {
                return data.rows[0];
            } else {
                return null;
            }
        } catch (err) {
            console.error('Error in updateByUsername:', err);
            throw err;
        }
    },
};

module.exports = Account;