const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log(path.join(__dirname, 'uploads'));
// Routes
app.use('/api', authRoutes);
app.use('/api', employeeRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
