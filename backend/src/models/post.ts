const pool = require('../db');
const bcryptjs = require('bcryptjs');
const Account = require('./account')

const Post = {
    // properties
    id: '',               // Post ID
    text_content: '',     // Text content of the post
    user_id: '',          // ID of the user who created the post
    created_at: '',       // Timestamp indicating when the post was created  
    updated_at: '',       // Timestamp indicating when the post was updated  

    // Method to retrieve all posts
    getAllPosts: async () => {
        try {
          const query = `
            SELECT
                p.id,
                p.text_content,
                p.created_at,
                p.updated_at,
                JSON_BUILD_OBJECT(
                    'user_id', a.id,
                    'firstname', a.firstname,
                    'lastname', a.lastname,
                    'email', a.email,
                    'username', a.username,
                    'password', a.password,
                    'token', a.token
                ) AS account
            FROM
            post p
            JOIN
            account a ON p.user_id = a.id;
            `;
          const data = await pool.query(query);
    
          return data.rows;
        } catch (err) {
          console.error('Error in getAllPosts:', err);
          throw err;
        }
      },

    // Method to retrieve a post by ID
    getById: async (id: any) => {
        try {
            const query = {
                text: `
                SELECT
                    p.id,
                    p.text_content,
                    p.created_at,
                    p.updated_at,
                    JSON_BUILD_OBJECT(
                        'user_id', a.id,
                        'firstname', a.firstname,
                        'lastname', a.lastname,
                        'email', a.email,
                        'username', a.username,
                        'password', a.password,
                        'token', a.token
                    ) AS account
                FROM post p
                JOIN account a ON p.user_id = a.id
                WHERE p.id = $1
                `,
                values: [id],
            };

            const data = await pool.query(query);

            if (data.rows.length > 0) {
                return data.rows[0];
            } else {
                return null;
            }
        } catch (err) {
            console.error('Error in getPostById:', err);
            throw err;
        }
    },

    // Method to create a new post with account ID
    createNew: async (text_content: string, user_id: number, created_at: any) => {
        try {
            const query = {
                text: `INSERT INTO post(text_content, user_id, created_at, updated_at)
                    VALUES($1, $2, $3, null)
                    RETURNING *`,
                values: [text_content, user_id, created_at],
            };

            const data = await pool.query(query);

            if (data.rows.length > 0) {
                return data.rows[0];
            } else {
                return null;
            }
        } catch (err) {
            console.error('Error in createNewPost:', err);
            throw err;
        }
    },

    // Method to create a new post with token
    createNewWithToken: async (text_content: string, token: string, created_at: any) => {
        try {
            const account = await Account.getByToken(token);
            console.log("accountID: " + account.id);
            const query = {
                text: `INSERT INTO post(text_content, user_id, created_at, updated_at)
                    VALUES($1, $2, $3, null)
                    RETURNING *`,
                values: [text_content, account.id, created_at],
            };

            const data = await pool.query(query);

            if (data.rows.length > 0) {
                return data.rows[0];
            } else {
                return null;
            }
        } catch (err) {
            console.error('Error in createNewPost:', err);
            throw err;
        }
    },

    // Method to update a post by ID
    updateById: async (id: any, new_content: string, updated_at: any) => {
        try {
            const oldData = await Post.getById(id);

            if (!oldData) {
                return null;
            }

            const updatedData = {
                new_content: new_content || oldData.text_content,
                updated_at: updated_at,
            };

            const query = {
                text: `UPDATE post
                    SET text_content = $2, updated_at = $3
                    WHERE id = $1
                    RETURNING *`,
                values: [id, updatedData.new_content, updatedData.updated_at],
            };

            const data = await pool.query(query);

            if (data.rows.length > 0) {
                return data.rows[0];
            } else {
                return null;
            }
        } catch (err) {
            console.error('Error in updatePostById:', err);
            throw err;
        }
    },

    // Method to delete a post by ID
    deleteById: async (id: any) => {
        try {
            const query = {
                text: 'DELETE FROM post WHERE id = $1',
                values: [id],
            };

            await pool.query(query);

            return { message: 'Post deleted successfully' };
        } catch (err) {
            console.error('Error in deletePostById:', err);
            throw err;
        }
    },
};

module.exports = Post;