const express = require('express')
const cors = require('cors'); // Import the cors middleware
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs')
const session = require('express-session')
const cookieParser = require('cookie-parser');
var pool = require('./db')
const app = express();
const port = 3001;

app.use(cors({ origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}))

// CONTROLLER ROUTES
const accountApiRouter = require('./routes/api/accountApiRoutes');
app.use('/api/users', accountApiRouter);

const authRoutes = require('./routes/authRoutes'); // Import the AuthController
// Auth endpoint for user login
app.use('/', authRoutes);

// Defines a protected route
app.get('/protected', (req: any, res: any) => {
  res.json({ message: 'You have access to this protected resource.' });
});

// Endpoint for checking active session
app.get('/check-session', (req: any, res: any) => {
  if (req.session.username) {
    res.status(200).json({ valid: true, username: req.session.username });
  } else {
    res.status(401).json({ valid: false });
  }
});

// API endpoint for account registration
app.post('/signup', async (req: any, res: any) => {
  const formData = req.body;
  const { username, firstName, lastName, email, password } = req.body;

    // Check if the username already exists in the database
    const checkUsernameQuery = {
      text: 'SELECT username FROM account WHERE username = $1',
      values: [username],
    };

  // Log the form data
  console.log('Received form data:', formData);

  if (Object.keys(formData).length === 0) {
    return res.status(400).json({ error: 'Form data is empty' });
  }

  try {
    const usernameExists = await pool.query(checkUsernameQuery);
    
    if (usernameExists.rows.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    
    // Hash the user's password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = {
      text:
        'INSERT INTO account (username, firstname, lastname, email, password) VALUES ($1, $2, $3, $4, $5)',
      values: [username, firstName, lastName, email, hashedPassword],
    };

    await pool.query(query);

    // If form data is not empty, return a 200 OK response
    res.status(200).json({ message: 'Form data received and processed successfully' });
    console.log({ username: username, firstName: firstName, lastName: lastName, email: email, hashedPassword: hashedPassword, password: password })
  } catch (error) {
    console.error(error);
    res.status(500).send('Registration failed');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
