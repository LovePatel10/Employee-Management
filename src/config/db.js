const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employee_management',
  connectionLimit: 10,
});

module.exports = pool;
