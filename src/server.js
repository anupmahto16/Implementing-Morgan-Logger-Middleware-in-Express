const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'src', 'access.log'), { flags: 'a' });

// Define custom Morgan format
morgan.format('custom', (tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    tokens['response-time'](req, res), 'ms',
    new Date().toISOString(),
    `HTTP/${req.httpVersion}`,
    tokens.url(req, res)
  ].join(' ');
});

// Setup the logger
app.use(morgan('custom', { stream: accessLogStream }));

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.status(200).send({ message: 'Welcome to the Express server!' });
});

app.get('/get-users', (req, res) => {
  res.status(200).send({ message: 'Here are the users' });
});

app.post('/add-user', (req, res) => {
  res.status(201).send("User added successfully");
});

app.put('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.status(201).send(`User with id ${userId} updated successfully`);
});

app.delete('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.status(200).send(`User with id ${userId} deleted successfully`);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
