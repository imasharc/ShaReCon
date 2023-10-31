const express = require('express')
const cors = require('cors'); // Import the cors middleware
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs')
const session = require('express-session')
const cookieParser = require('cookie-parser');
var pool = require('./db')
const { validateToken } = require('./utils/JWT')
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
app.get('/check-session', validateToken, (req: any, res: any) => {
  res.json('check-session');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
