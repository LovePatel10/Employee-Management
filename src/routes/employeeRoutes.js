const express = require('express');
const employeeController = require('../controllers/employeeController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/employees', authenticate, employeeController.createEmployee);
router.get('/employees', authenticate, employeeController.getAllEmployees);
router.get('/employees/:id', authenticate, employeeController.getEmployeeById);
router.delete('/employees/:id', authenticate, employeeController.deleteEmployeeById);

module.exports = router;
