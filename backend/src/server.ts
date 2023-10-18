const express = require('express')
const cors = require('cors'); // Import the cors middleware
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.use(cors({ origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(bodyParser.json());

// Dummy user data (replace this with a database)
const users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
];

// Login endpoint
app.post('/login', (req: any, res: any) => {
  const { username, password } = req.body; // Parse the user input from the JSON request body

  // Find the user in the dummy user data (replace with database query)
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    // Authentication successful
    res.status(200).json({ message: 'Login successful' });
  } else {
    // Authentication failed
    res.status(401).json({ message: 'Login failed' });
  }
});

app.post('/signup', (req: any, res: any) => {
  const formData = req.body;

  // Log the form data
  console.log('Received form data:', formData);

  if (Object.keys(formData).length === 0) {
    return res.status(400).json({ error: 'Form data is empty' });
  }

  // If form data is not empty, return a 200 OK response
  res.status(200).json({ message: 'Form data received and processed successfully' });
});

// Define a simple endpoint that returns text
app.get('/api/text', (req: any, res: any) => {
  res.status(200).json({ "hello": 'world'})
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
