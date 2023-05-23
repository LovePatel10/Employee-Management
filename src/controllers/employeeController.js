const fs = require("fs");
const path = require("path");
const multer = require("multer");
const pool = require("../config/db");
const Employee = require("../models/employeeModel");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Multer File Filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only image files are allowed."), false);
  }
};

// Multer Upload Configuration
const upload = multer({ storage, fileFilter });

// Create Employee with Image Upload
exports.createEmployee = (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { name, position } = req.body;
    const imageFilePath = req.file ? req.file.path : "";

    const employee = new Employee({ name, position, image: imageFilePath });

    employee.save((err, employeeId) => {
      if (err) {
        // If there was an error, delete the uploaded image
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ message: "Error creating employee" });
      }
      res
        .status(201)
        .json({ message: "Employee created successfully", employeeId });
    });
  });
};

exports.getAllEmployees = (req, res) => {
  // const employee = new Employee();

  Employee.getAll((err, employeeId) => {
    if (err) {
      // If there was an error, delete the uploaded image
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({ message: "Error creating employee" });
    }
    res
      .status(201)
      .json({ message: "Employee created successfully", employeeId });
  });
};


exports.getEmployeeById = (req, res) => {
  const employeeId = req.params.id;

  Employee.getById(employeeId, (err, employee) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving employee' });
    }
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ employee });
  });
};

exports.deleteEmployeeById = (req, res) => {
  const employeeId = req.params.id;

  Employee.deleteById(employeeId, (err, affectedRows) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting employee' });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  });
};