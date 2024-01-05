const pool = require('../db');
const bcryptjs = require('bcryptjs');
const Account = require('./account')

const Comment = {
    // properties
    id: '',               // Post ID
    text_content: '',     // Text content of the post
    user_id: '',          // ID of the user who created the post
    post_id: '',          // ID of the post to which comment is written
    created_at: '',       // Timestamp indicating when the post was created  
    updated_at: '',       // Timestamp indicating when the post was updated  

    // Method to retrieve all posts
    getAllComments: async () => {
        try {
          const query = `
          SELECT
                p.id AS post_id,
                p.text_content AS post_text_content,
                p.created_at AS post_created_at,
                p.updated_at AS post_updated_at,
                a_post.username AS post_author_username,
                c.id AS comment_id,
                c.text_content AS comment_text_content,
                c.created_at AS comment_created_at,
                c.updated_at AS comment_updated_at,
                a_comment.username AS comment_author_username
            FROM
                post p
            JOIN
                account a_post ON p.user_id = a_post.id
            JOIN
                comment c ON p.id = c.post_id
            JOIN
                account a_comment ON c.user_id = a_comment.id
            WHERE
                p.id IN (
                    SELECT DISTINCT post_id FROM comment
                );
            `;
          const data = await pool.query(query);
    
          return data.rows;
        } catch (err) {
          console.error('Error in getAllPosts:', err);
          throw err;
        }
      },

    // Method to retrieve a comment by ID
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
                    c.id = $1
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
            console.error('Error in getById:', err);
            throw err;
        }
    },

    // Method to retrieve a comment by PostId
    getByPostId: async (id: any) => {
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

    // Method to retrieve comment by author's username
    getByUsername: async (username: string) => {
        try {
            const query = {
                text: `
                SELECT
                    p.id AS post_id,
                    p.text_content AS post_text_content,
                    p.created_at AS post_created_at,
                    p.updated_at AS post_updated_at,
                    a_post.username AS post_author_username,
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'comment_id', c.id,
                            'comment_text_content', c.text_content,
                            'comment_created_at', c.created_at,
                            'comment_updated_at', c.updated_at,
                            'comment_author_username', a_comment.username
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
                    a_comment.username = $1
                GROUP BY
                    p.id, a_post.username;
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

    // Method to create a new comment with token
    createNewWithToken: async (text_content: string, post_id: number, token: string, created_at: any) => {
        try {
            const account = await Account.getByToken(token);
            console.log("accountID: " + account.id);
            const query = {
                text: `INSERT INTO comment(text_content, user_id, post_id, created_at, updated_at)
                    VALUES($1, $2, $3, $4, null)
                    RETURNING *`,
                values: [text_content, account.id, post_id, created_at],
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
            const oldData = await Comment.getByPostId(id);

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
                text: 'DELETE FROM comment WHERE id = $1',
                values: [id],
            };

            await pool.query(query);

            return { message: 'Comment deleted successfully' };
        } catch (err) {
            console.error('Error in deleteCommentById:', err);
            throw err;
        }
    },
};

module.exports = Comment;