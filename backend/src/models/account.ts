const pool = require('../config/config');

const Account = {
    // properties
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',

    // Method to retrieve an account by username
    getByUsername: (username: string) => {
        return pool.query('SELECT * FROM account WHERE username = $1', [username])
      .then((result: { rows: any[]; }) => result.rows[0]);
    }
};
