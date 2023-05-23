const pool = require('../config/db');

class Employee {
  constructor({ name, position, image }) {
    this.name = name;
    this.position = position;
    this.image = image;
  }

  save(callback) {
    const query = 'INSERT INTO employees (name, position, image) VALUES (?, ?, ?)';
    const values = [this.name, this.position, this.image];

    pool.query(query, values, (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result.insertId);
    });
  }

  static getAll(callback) {
    const query = 'SELECT * FROM employees';

    pool.query(query, (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static getById(employeeId, callback) {
    const query = 'SELECT * FROM employees WHERE id = ?';
    const values = [employeeId];
  
    pool.query(query, values, (err, results) => {
      if (err) {
        return callback(err);
      }
      if (results.length === 0) {
        return callback(null, null); // Employee not found
      }
      const employee = results[0];
      callback(null, employee);
    });
  }

  static deleteById(employeeId, callback) {
    const query = 'DELETE FROM employees WHERE id = ?';
    const values = [employeeId];
  
    pool.query(query, values, (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result.affectedRows);
    });
  }
}

module.exports = Employee;
