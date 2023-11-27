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
                a.username
            FROM
                post p
            JOIN
                account a ON p.user_id = a.id
            ORDER BY
                p.created_at DESC;
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
                    a_post.username,
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', c.id,
                            'text_content', c.text_content,
                            'created_at', c.created_at,
                            'updated_at', c.updated_at,
                            'username', a_comment.username
                        )
                    ) AS comments
                FROM
                    post p
                JOIN
                    account a_post ON p.user_id = a_post.id
                LEFT JOIN
                    comment c ON p.id = c.post_id
                LEFT JOIN
                    account a_comment ON c.user_id = a_comment.id
                WHERE
                    p.id = $1
                GROUP BY
                    p.id, a_post.username;
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

    // Method to retrieve psot by author's username
    getByUsername: async (username: string) => {
        try {
            const query = {
                text: `
                SELECT
                    a.id,
                    a.username,
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', p.id,
                            'text_content', p.text_content,
                            'created_at', p.created_at,
                            'updated_at', p.updated_at,
                            'username', a.username
                        )
                    ) AS posts
                FROM
                    account a
                JOIN
                    post p ON a.id = p.user_id
                WHERE
                    a.username = $1
                GROUP BY
                    a.id, a.username;
`,
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