'use strict'

require('dotenv').config();
const mongoose = require('mongoose');
const BookModel = require('./BookModel.js');
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL);

function seedFiles(){
  let book1 = BookModel({
    title: 'The Things They Carried',
    description: 'collection of linked short stories about a platoon of American soldiers fighting on the ground in the Vietnam War',
    status: 'Must Read'
  });
  let book2 = BookModel({
    title: 'One Flew Over the Cuckoo\'s Nest',
    description: 'the narrative serves as a study of institutional processes and the human mind',
    status: 'Must Read'
  });
  let book3 = BookModel({
    title: 'Frankenstein',
    description: 'English author Mary Shelley. Frankenstein tells the story of Victor Frankenstein, a young scientist who creates a sapient creature in an unorthodox scientific experiment.',
    status: 'Must Read'
  });
  
  Promise.all([
    book1.save(),
    book2.save(),
    book3.save()
    ]).then(documents => {
    console.log(documents);
  });
}

module.exports = seedFiles;
