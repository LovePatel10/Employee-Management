const pool = require('../config/db');

class User {
  constructor({ username, password }) {
    this.username = username;
    this.password = password;
  }

  save(callback) {
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const values = [this.username, this.password];

    pool.query(query, values, (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result.insertId);
    });
  }

  static findByUsername(username, callback) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const values = [username];

    pool.query(query, values, (err, results) => {
      if (err) {
        return callback(err);
      }
      if (results.length === 0) {
        return callback(null, null);
      }
      const user = results[0];
      callback(null, user);
    });
  }
}

module.exports = User;
