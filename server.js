'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const BookModel = require('./BookModel');
const seed = require('./seed.js');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;
const MONGODB_URL = process.env.MONGODB_URL;

//seed();

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

app.get('/test', (request, response) => {

  response.send('test request received');

})


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
