// API: Retrieve Students Above Threshold
// ---------------------------------------
// Task:
// Implement an API to fetch students whose total marks exceed a given threshold.
//
// Endpoint:
// POST /students/above-threshold
//
// Request Body:
// {
//   "threshold": <number>
// }
//
// Response:
// Success: List of students with their names and total marks who meet the criteria.
// Example:
// {
//   "count": 2,
//   "students": [
//     { "name": "Alice Johnson", "total": 433 },
//     { "name": "Bob Smith", "total": 410 }
//   ]
// }
//
// No Matches:
// {
//   "count": 0,
//   "students": []
// }
//
// Purpose:
// Help teachers retrieve and analyze student performance efficiently.

const express = require('express');
const fs = require('fs');
const { resolve } = require('path');

const app = express();
const PORT = 3010;

// Middleware for JSON parsing
app.use(express.json());

// Serve static files from the "static" directory
app.use(express.static('static'));

// Serve the default HTML page on GET /
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// Load student data from a JSON file
let studentData;
try {
  studentData = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
} catch (error) {
  console.error('Error reading or parsing data.json:', error.message);
  process.exit(1); // Exit if there's an issue with the dataset
}

// API Endpoint: POST /students/above-threshold
app.post('/students/above-threshold', (req, res) => {
  const { threshold } = req.body;

  // Validate the threshold
  if (threshold === undefined || typeof threshold !== 'number') {
    return res
      .status(400)
      .json({ error: "'threshold' must be a number and is required" });
  }
  if (threshold < 0) {
    return res
      .status(400)
      .json({ error: "'threshold' must be a non-negative number." });
  }

  // Filter students based on the threshold
  const filteredStudents = studentData
    .filter((student) => student.total > threshold)
    .map((student) => ({
      name: student.name,
      total: student.total,
    }));

  // Return the response
  res.json({
    count: filteredStudents.length,
    students: filteredStudents,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
