const express = require('express')
const cors = require('cors'); // Import the cors middleware
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs')
const session = require('express-session')
var pool = require('./db')
const app = express();
const port = 3001;

app.use(cors({ origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(bodyParser.json());

/**
 * ENDPOINTS:
 * 1. GET /setup -> Setting up a single table in postgres
 * 2. GET / -> Return all rows from account table
 * 3. GET /user/:username -> Return specific user data based on it's username
 * 4. GET /api/text -> Defines a simple endpoint that returns text
 * 5. POST /login -> API endpoint for user login
 * 6. GET /protected -> Defines a protected route
 * 7. POST /signup -> API endpoint for account registration
 */
// Setting up a single table in postgres
app.get('/setup', async (req: any, res: any) => {
  try {
    await pool.query(`CREATE TABLE account
    (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50),
      firstname VARCHAR(50),
      lastname VARCHAR(50),
      email VARCHAR(50),
      password VARCHAR(100)
      );`)
    res.status(200).send({ message: `Successfully created table user`})
  } catch (err) {
    console.log(err)
    res.status(500).json({ "failAt": 'GET /setup'})
    pool.end();
  }
});

// Return all rows from account table
app.get('/', async (req: any, res: any) => {
  try {
    const data = await pool.query(`SELECT * FROM account;`)
    res.status(200).send(data.rows)
  } catch (err) {
    console.log(err)
    res.status(500).json({ "failAt": 'GET /'})
    pool.end();
  }
});

// Return specific user data based on it's username
app.get('/user/:username', async (req: any, res: any) => {
  const { username } = req.params;

  try {
    const query = {
      text: `SELECT username, firstname, lastname, email FROM account WHERE username = $1`,
      values: [username]
    }

    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    res.status(200).json(user);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal server error" })
    console.log({ "failAt": 'GET /'})
    // pool.end();
  }
});

// Defines a simple endpoint that returns text
app.get('/api/text', (req: any, res: any) => {
  res.status(200).json({ "status": 'success!!'})
});

// API endpoint for user login
app.post('/login', , async (req: any, res: any) => {
  const { username, password } = req.body; // Parse the user input from the JSON request body

  // Query the database to retrieve password for the user
  const query = {
    text: `SELECT password FROM account WHERE username = $1`,
    values: [username]
  }

  try {
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return res.status(401).send('Invalid username or password');
    }

    const storedPassword = result.rows[0].password;
    const passwordsMatch = await bcrypt.compare(password, storedPassword);

    if (passwordsMatch) {
      // Authentication successful
      res.status(200).json({ message: 'Login successful' });
      console.log({username: username, password: password })
    } else {
      // Authentication failed
      res.status(401).json({ message: 'Login failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Defines a protected route
app.get('/protected', (req: any, res: any) => {
  res.json({ message: 'You have access to this protected resource.' });
});

// Define a logout route


// API endpoint for account registration
app.post('/signup', , async (req: any, res: any) => {
  const formData = req.body;
  const { username, firstName, lastName, email, password } = req.body;

  // Log the form data
  console.log('Received form data:', formData);

  if (Object.keys(formData).length === 0) {
    return res.status(400).json({ error: 'Form data is empty' });
  }

  try {
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
