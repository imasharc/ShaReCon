const express = require('express')
const cors = require('cors'); // Import the cors middleware
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs')
var pool = require('./db')
const app = express();
const port = 3001;

app.use(cors({ origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(bodyParser.json());

// ENDPOINTS

// Setting up a single table in postgres
app.get('/setup', async (req: any, res: any) => {
  try {
    await pool.query(`CREATE TABLE account (id SERIAL PRIMARY KEY, username VARCHAR(50), firstName VARCHAR(50), lastName VARCHAR(50), email VARCHAR(50), password VARCHAR(100));`)
    res.status(200).send({ message: `Successfully created table user`})
  } catch (err) {
    console.log(err)
    res.status(500).json({ "failAt": 'GET /setup'})
    pool.end();
  }
});

// Return all rows from 'user' table
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

// Insert a new user into table 'user'
app.post('/', async (req: any, res: any) => {
  const { username, firstName, lastName, email, password } = req.body
  try {
    await pool.query(`INSERT INTO account
    (
      username,
      firstName,
      lastName,
      email,
      password
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4,
      $5
    );`, [username, firstName, lastName, email, password])
    res.status(200).send({ message: `Successfully added user ${username}`})
  } catch (err) {
    console.log(err)
    res.status(500).json({ "failAt": 'POST /'})
    pool.end();
  }
});

// Define a simple endpoint that returns text
app.get('/api/text', (req: any, res: any) => {
  res.status(200).json({ "status": 'success!!'})
});

// API endpoint for user login
app.post('/login', async (req: any, res: any) => {
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
      console.log({username: username, password: password})
    } else {
      // Authentication failed
      res.status(401).json({ message: 'Login failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// API endpoint for account registration
app.post('/signup', async (req: any, res: any) => {
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
