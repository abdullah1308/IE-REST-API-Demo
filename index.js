// The API supports the following endpoints:
// GET /employees - Retrieves the list of all employees
// GET /employees/:id - Retrieves a specific employee by ID
// POST /employees - Creates a new employee
// PUT /employees/:id - Updates an existing employee by ID
// DELETE /employees/:id - Deletes an employee by ID

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const jsonParser = bodyParser.json();
const employeesFile = './database/data.json';

// Helper function to read the employee data from the JSON file
function readEmployees() {
  return JSON.parse(fs.readFileSync(employeesFile));
}

// Helper function to write the updated employee data to the JSON file
function writeEmployees(employees) {
  fs.writeFileSync(employeesFile, JSON.stringify(employees, null, 4));
}

// Retrieve the list of all employees
app.get('/employees', (req, res) => {
  const employees = readEmployees();
  res.send(employees);
});

// Retrieve a specific employee by ID
app.get('/employees/:id', (req, res) => {
  const employees = readEmployees();
  const employee = employees.find((e) => e.id === parseInt(req.params.id));
  if (!employee) {
    res.status(404).send('Employee not found');
  } else {
    res.send(employee);
  }
});

// Create a new employee
app.post('/employees', jsonParser, (req, res) => {
  const employees = readEmployees();
  const newEmployee = req.body;
  newEmployee.id = employees.length + 1; // Assign a new ID to the employee
  employees.push(newEmployee);
  writeEmployees(employees);
  res.send(newEmployee);
});

// Update an existing employee by ID
app.put('/employees/:id', jsonParser, (req, res) => {
  const employees = readEmployees();
  const employeeIndex = employees.findIndex((e) => e.id === parseInt(req.params.id));
  if (employeeIndex === -1) {
    res.status(404).send('Employee not found');
  } else {
    const updatedEmployee = req.body;
    updatedEmployee.id = parseInt(req.params.id); // Make sure the ID is updated as well
    employees[employeeIndex] = updatedEmployee;
    writeEmployees(employees);
    res.send(updatedEmployee);
  }
});

// Delete an employee by ID
app.delete('/employees/:id', (req, res) => {
  const employees = readEmployees();
  const employeeIndex = employees.findIndex((e) => e.id === parseInt(req.params.id));
  if (employeeIndex === -1) {
    res.status(404).send('Employee not found');
  } else {
    employees.splice(employeeIndex, 1);
    writeEmployees(employees);
    res.send('Employee deleted');
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
