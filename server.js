'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const BookModel = require('./BookModel');
const seed = require('./seed.js');
const bodyParser = require('body-parser');


const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL);

app.get('/books', async (req, res) => {
  try {
    let documents = await BookModel.find({});
    res.json(documents);
  } catch (e) {
    console.log('failed to find books');
    res.status(500).send(e);
  }

})

app.delete('/books/:id', async (req, res) => {
  try {
    // Check if a valid book ID is provided
    if (!req.params.id) {
      res.status(404).send('Please provide a valid book ID');
      return;
    }

    console.log('Deleting book with ID:', req.params.id);
    
    // Attempt to delete the book by ID
    const result = await BookModel.findByIdAndDelete(req.params.id);

    // Check if the book was found and deleted
    if (!result) {
      res.status(404).send('Book not found');
      return;
    }

    console.log('Book deleted:', result);
    
    // Send a success response
    res.status(204).send('Book deleted successfully');
  } catch (error) {
    // Handle any errors that occur during the deletion process
    console.error('Error deleting book:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/test', (request, response) => {


  response.send('test request received');

})

app.post('/books', async (req, res) => {

  try {
    let { title, description, status } = req.body;

    let book = new BookModel({ title, description, status });

    console.log(book);

    await book.save();
    // Send a response
    res.status(201).send('Book added successfully');


  } catch (e) {
    // Handle errors
    console.error('Error:', e.message);
    res.status(400).send(e.message);
  }


});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Check connection status
const db = mongoose.connection;

// Event handlers for connection events
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB!');
});

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// You can also check the ready state
switch (mongoose.connection.readyState) {
  case 0:
    console.log('Disconnected');
    break;
  case 1:
    console.log('Connected');
    break;
  case 2:
    console.log('Connecting');
    break;
  case 3:
    console.log('Disconnecting');
    break;
  default:
    console.log('Unknown state');
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
