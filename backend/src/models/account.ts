﻿const pool = require('../db');
const bcryptjs = require('bcryptjs');

const Account = {
    // properties
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    token: '',

    // Method to retrieve all accounts
    getAllAccounts: async () => {
        try {
            const query = `
            SELECT
                a.*,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'post_id', p.id,
                        'text_content', p.text_content,
                        'created_at', p.created_at,
                        'updated_at', p.updated_at
                    )
                ) AS posts
            FROM
                account a
            LEFT JOIN
                post p ON a.id = p.user_id
            GROUP BY
                a.id;
            `;
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
                text: `
                SELECT
                    a.*,
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'post_id', p.id,
                            'text_content', p.text_content,
                            'created_at', p.created_at,
                            'updated_at', p.updated_at
                        )
                    ) AS posts
                FROM
                    account a
                LEFT JOIN
                    post p ON a.id = p.user_id
                WHERE
                    a.username = $1
                GROUP BY
                    a.id;`,
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

    // Method to retrieve an account by id
    getById: async (id: any) => {
        try {
            const query = {
                text: `
                SELECT
                    a.*,
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'post_id', p.id,
                            'text_content', p.text_content,
                            'created_at', p.created_at,
                            'updated_at', p.updated_at
                        )
                    ) AS posts
                FROM
                    account a
                LEFT JOIN
                    post p ON a.id = p.user_id
                WHERE
                    a.id = $1
                GROUP BY
                    a.id;`,
                values: [id],
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

    // Method to retrieve an account by token
    getByToken: async (token: string) => {
        try {
            const query = {
                text: `
                SELECT
                    a.*,
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'post_id', p.id,
                            'text_content', p.text_content,
                            'created_at', p.created_at,
                            'updated_at', p.updated_at
                        )
                    ) AS posts
                FROM
                    account a
                LEFT JOIN
                    post p ON a.id = p.user_id
                WHERE
                    a.token = $1
                GROUP BY
                    a.id;`,
                values: [token],
            };

            const data = await pool.query(query);

            if (data.rows.length > 0) {
                // Return the first matching account as a JSON object
                console.log("account: " + query.values)
                console.log("account: " + JSON.stringify(data.rows[0]))
                return data.rows[0];
            } else {
                // If no matching account is found, return null
                return null;
            }
        } catch (err) {
            // Handle any errors that occur during the database query
            console.error('Error in getByToken:', err);
            throw err;
        }
    },

    createNew: async (username: string, firstName: string, lastName: string, email: string, password: string, token: string) => {
        try {
            // Check if the username is already taken
            const existingAccount = await Account.getByUsername(username);
            if (existingAccount) {
                return { error: 'Username is already taken' };
            }

            // Hash the password before inserting it into the database
            const hashedPassword = await bcryptjs.hash(password, 10);

            // Insert a new account record into the database
            const query = {
                text: `INSERT INTO account(username, firstName, lastName, email, password, token)
                    VALUES($1, $2, $3, $4, $5, $6)
                    RETURNING *`,
                values: [username, firstName, lastName, email, hashedPassword, token],
            };

            const data = await pool.query(query);

            if (data.rows.length > 0) {
                return data.rows[0];
            } else {
                return null;
            }
        } catch (err) {
            console.error('Error in createNew:', err);
            throw err;
        }
    },

    updatePfpByUsername: async (username: string, profile_picture: string) => {
        try {
            // Fetch the old data for the user
            const oldData = await Account.getByUsername(username);

            if (!oldData) {
                return null; // Handle the case where the user does not exist
            }

            // Compare the old data with the new data
            const updatedData = {
                profile_picture: profile_picture || oldData.profile_picture,
            };

            // Hash the new password if provided, otherwise, use the old hashed password
            // const hashedPassword = updatedData.password ? await bcryptjs.hash(password, 10) : oldData.password;

            console.log(updatedData.profile_picture);
            const query = {
                text: `UPDATE account
                    SET profile_picture = $2
                    WHERE username = $1
                    RETURNING *`,
                values: [username, updatedData.profile_picture],
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

    updateByUsername: async (username: string, newUsername: string, firstName: string, lastName: string, email: string, password: string, token: string) => {
        try {
            // Fetch the old data for the user
            const oldData = await Account.getByUsername(username);

            if (!oldData) {
                return null; // Handle the case where the user does not exist
            }

            // Compare the old data with the new data
            const updatedData = {
                username: newUsername || oldData.username,
                firstName: firstName || oldData.firstName,
                lastName: lastName || oldData.lastName,
                email: email || oldData.email,
                password: password || password,
            };

            // Hash the new password if provided, otherwise, use the old hashed password
            const hashedPassword = updatedData.password ? await bcryptjs.hash(password, 10) : oldData.password;

            console.log(password);
            const query = {
                text: `UPDATE account
                    SET username = $2, firstname = $3, lastname = $4, email = $5, password = $6, token = $7
                    WHERE username = $1
                    RETURNING *`,
                values: [username, updatedData.username, updatedData.firstName, updatedData.lastName, updatedData.email, hashedPassword, token],
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

    updateAccessToken: async (username: string, token: string) => {
        try {
            // Fetch the old data for the user
            const oldData = await Account.getByUsername(username);

            if (!oldData) {
                return null; // Handle the case where the user does not exist
            }

            const query = {
                text: `UPDATE account
                    SET token = $2
                    WHERE username = $1
                    RETURNING *`,
                values: [username, token],
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

    deleteByUsernameAndPassword: async (username: string, password: string) => {
        try {
            // Fetch the account with the provided username
            const account = await Account.getByUsername(username);

            // If the account does not exist, return null
            if (!account) {
                return { message: 'Provided account does not exist' };
            }

            // Compare the provided password with the hashed password in the account
            const isPasswordValid = await bcryptjs.compare(password, account.password);


            console.log(password);
            console.log(await bcryptjs.hash(password, 10));
            console.log(account.password);
            console.log(isPasswordValid);
            // If the passwords match, proceed to delete the account
            if (isPasswordValid) {
                const deleteQuery = {
                    text: 'DELETE FROM account WHERE username = $1',
                    values: [username],
                };
                await pool.query(deleteQuery);
                return { message: 'Account deleted successfully' };
            } else {
                // Password is incorrect, return null
                return null;
            }
        } catch (err) {
            console.error('Error in deleteByUsernameAndPassword:', err);
            throw err;
        }
    },
};

module.exports = Account;