'use strict';

const mongoose = require('mongoose');

// Create Schema
const BookSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
  },

});

const BookModel = mongoose.model('books', BookSchema);

module.exports = BookModel;