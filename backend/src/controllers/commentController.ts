const Account = require('../models/account');
const Post = require('../models/post');
const Comment = require('../models/comment');
const { createTokens } = require('../utils/JWT')

module.exports = {
    // Get all comments
    getAllComments: async (req: any, res: any) => {
        try {
            const comments = await Comment.getAllComments();

            res.status(200).json({ comments });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get Comment by id
    getById: async (req: any, res: any) => {
        const { id } = req.params; // Use req.params to get the username from the route params

        try {
            const data = await Comment.getById(id);

            if (data) {
                res.status(200).json({ post: data });
            } else {
                res.status(404).json({ message: 'Comment not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get Cpomment by PostId
    getByPostId: async (req: any, res: any) => {
        const { id } = req.params; // Use req.params to get the username from the route params

        try {
            const data = await Comment.getByPostId(id);

            if (data) {
                res.status(200).json({ post: data });
            } else {
                res.status(404).json({ message: 'Post not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get Account by username
    getByUsername: async (req: any, res: any) => {
        const { username } = req.params; // Use req.params to get the username from the route params

        try {
            const data = await Comment.getByUsername(username);

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

    // Create new post with tokeb
    createNewWithToken: async (req: any, res: any) => {
        const reqNew = {
            text_content: req.body.comment.text_content,
            post_id: req.body.comment.post_id,
            token: req.body.comment.token,
            // updated_at: req.body.post.updated_at,
        }
        console.log(req.body);
        console.log(reqNew);

        const account = Account.getByToken(reqNew.token);
        const accessToken = createTokens(account.username);
        console.log(accessToken);

        try {
            // Create a new account, checking if the username is available
            const currentDateTime = new Date();
            const formattedDateTime = `${currentDateTime.getFullYear()}-${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}-${currentDateTime.getDate().toString().padStart(2, '0')} ${currentDateTime.getHours().toString().padStart(2, '0')}:${currentDateTime.getMinutes().toString().padStart(2, '0')}:${currentDateTime.getSeconds().toString().padStart(2, '0')}`;
            const newComment = await Comment.createNewWithToken(reqNew.text_content, reqNew.post_id, reqNew.token, formattedDateTime);

            if (newComment && !newComment.error) {
                res.status(201).json({ message: 'Post created successfully', post: newComment });
            }
            //  else if (newAccount && newAccount.error === 'Username is already taken') {
            //     res.status(400).json({ message: 'Username is already taken' });
            // } else if (!reqNew.username || !reqNew.firstName || !reqNew.lastName || !reqNew.email || !reqNew.password) {
            //     res.status(400).json({ message: 'Field(s) are missing' });
            // } else {
            //     res.status(500).json({ error: 'Internal server error' });
            // }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },



    // Update an account by username
    updateById: async (req: any, res: any) => {
        const { id } = req.params; // Get the original post id from the route params
        const reqUpdates = {
            text_content: req.body.post.text_content || null,
        }

        const doesPostExist = await Post.getById(id);

        if (!doesPostExist) {
            return res.status(400).json({ message: 'No such post exists' });
        }

        // Proceed with the update if the post exists
        const currentDateTime = new Date();
        const formattedDateTime = `${currentDateTime.getFullYear()}-${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}-${currentDateTime.getDate().toString().padStart(2, '0')} ${currentDateTime.getHours().toString().padStart(2, '0')}:${currentDateTime.getMinutes().toString().padStart(2, '0')}:${currentDateTime.getSeconds().toString().padStart(2, '0')}`;
        const updatedPost = await Post.updateById(id, reqUpdates.text_content, formattedDateTime);

        if (updatedPost) {
            res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    },

    // Delete an account by username and paasword
    deleteById: async (req: any, res: any) => {
        const { id } = req.params; // Get the username from the route params
        // const { token } = req.body;

        try {
            console.log(req.body);
            const account = await Account.getByToken(req.body.comment.token);
            const comment = await Comment.getById(req.body.comment.comment_id);
            console.log(account.username);
            console.log(comment.comments[0].username);
            
            if (comment.comments[0].username !== account.username) {
                res.status(500).json({ error: 'Cannot delete comment' });
                return null;
            }
            const result = await Comment.deleteById(id);

            if (result) {
                // Account was deleted successfully or password was correct
                res.status(200).json(result);
            } else {
                // Account not found or password incorrect
                res.status(404).json({ message: 'Comment not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};
