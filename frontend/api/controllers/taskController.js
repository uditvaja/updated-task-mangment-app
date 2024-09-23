const Task = require('../models/task');  // Task model
const fs = require('fs');
const csv = require('csv-parser');  // CSV parser package
const { Parser } = require('json2csv');
const streamifier = require('streamifier');
// Import tasks from CSV
const importTasksFromCSV = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const tasks = [];

  // Read the CSV file from the saved path
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      const task = {
        description: row.description,
        category: row.category,
        dueDate: new Date(row.dueDate),
        status: row.status,
        assignedTo: row.assignedTo,
      };
      tasks.push(task);
    })
    .on('end', async () => {
      try {
        await Task.insertMany(tasks);
        res.status(200).json({ message: 'Tasks imported successfully', tasks });
      } catch (error) {
        res.status(500).json({ message: 'Error importing tasks into the database', error: error.message });
      }
    })
    .on('error', (error) => {
      res.status(500).json({ message: 'Error reading CSV file', error: error.message });
    });
};
// Export tasks to CSV (already implemented)
const exportTasksToCSV = async (req, res) => {
  try {
    // Fetch tasks from the database
    const tasks = await Task.find(); // Ensure your model and query are correct

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found' });
    }

    // Define CSV fields
    const fields = ['description', 'category', 'dueDate', 'status', 'assignedTo'];
    const opts = { fields };

    // Convert JSON to CSV
    const parser = new Parser(opts);
    const csv = parser.parse(tasks);

    // Set the CSV download headers
    res.header('Content-Type', 'text/csv');
    res.attachment('tasks.csv');
    res.status(200).send(csv);

  } catch (error) {
    console.error('Error exporting tasks to CSV:', error);
    res.status(500).json({ message: 'Error exporting tasks to CSV', error });
  }
};

// Exporting both functions
module.exports = { importTasksFromCSV, exportTasksToCSV };
