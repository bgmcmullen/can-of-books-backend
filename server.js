'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const BookModel = require('./BookModel');
const bodyParser = require('body-parser');
const verifyUser = require('./auth/authorize');


const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;


mongoose.connect(MONGODB_URI);

app.use(verifyUser);

app.get('/books', async (req, res) => {
  let queryObject = {email: req.user.email};
  try {
    let documents = await BookModel.find(queryObject);
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

    
    // Attempt to delete the book by ID
    const result = await BookModel.findByIdAndDelete(req.params.id);

    // Check if the book was found and deleted
    if (!result) {
      res.status(404).send('Book not found');
      return;
    }


    app.put('/books/:id', async (req, res) => {
      let id = req.params.id;

      let { title, description, status } = req.body;

      let email = req.user.email;
  
      try {
        await BookModel.findByIdAndUpdate(id, { email, title, description, status });
        res.status(200).send("Book updated successfully");
      } catch (e) {
        res.status(500).send(e.message);
      }
    });
    
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

    let email = req.user.email;

    let book = new BookModel({ email, title, description, status });


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
