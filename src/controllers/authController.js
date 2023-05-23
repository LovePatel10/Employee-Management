const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { secretKey, expiresIn } = require('../config/jwt');

// User Registration
exports.register = (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error hashing password' });
    }

    const user = { username, password: hashedPassword };

    pool.query('INSERT INTO users SET ?', user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error registering user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

// User Login
exports.login = (req, res) => {
  const { username, password } = req.body;

  pool.query(
    'SELECT * FROM users WHERE username = ?',
    username,
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (err, match) => {
        if (err || !match) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ username: user.username }, secretKey, {
          expiresIn,
        });

        res.json({ token });
      });
    }
  );
};
