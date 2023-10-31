const accountController = require('./accountController'); // Adjust the path as needed
const bcrypt = require('bcryptjs'); // For password hashing and comparison

const AuthController = {
    login: async (req: any, res: any) => {
        const { username, password } = req.body;
  
      try {
        // Check if the username exists
        const account = await accountController.loginByUsername(req.body.account.username);
  
        if (!account) {
          return res.status(401).json({ message: 'Invalid username or password' });
        }
  
        // Compare the provided password with the stored hashed password
        const passwordsMatch = await bcrypt.compare(req.body.account.password, account.password);
  
        if (passwordsMatch) {
          // Authentication successful
          return res.status(200).json({ message: 'Login successful' });
        } else {
          // Authentication failed
          return res.status(401).json({ message: 'Invalid username or password' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    },
  };
  
  module.exports = AuthController;
  