'use strict';

const mongoose = require('mongoose');

// Creat Schema
const BookSchema = new mongoose.Schema({
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