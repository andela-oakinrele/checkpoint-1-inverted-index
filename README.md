
[![Build Status](https://travis-ci.org/andela-oakinrele/inverted-index.svg?branch=master)](https://travis-ci.org/andela-oakinrele/inverted-index)
[![Coverage Status](https://coveralls.io/repos/github/andela-oakinrele/inverted-index/badge.svg?branch=master)](https://coveralls.io/github/andela-oakinrele/inverted-index?branch=master)
# Inverted Index
## Overview
### Concept
This is a simple inverted index application that allows a user upload JSON files asynchronously, create an index of each uploaded JSON file, provided it has the properties of a title and a text, and also search through the indexed files.

The purpose of an inverted index is to allow fast full text searches, at a cost of increased processing when a document is added to the database.

### References
* [Inverted index - wikipedia.com](https://en.wikipedia.org/wiki/Inverted_index) 

* [Inverted index - elastic search](https://www.elastic.co/guide/en/elasticsearch/guide/current/inverted-index.html) 

## Use Cases
- You have large number of documents you need to perform search operations on.

## Limitations
- This app can only work for JSON files with members having `title` and `text` properties.


## Running Locally
Follow the steps below to run the application locally on your machine.
 1. Clone the repository: `git clone <THIS_REPOSITORY_URL>`
 2. Enter into the apps directory by running `cd inverted-index`
 3. Install npm packages `npm install`
 4. Run the app by typing `gulp`
 
## How to Use 
Using this app is very simple and intuitive,
  1. Start the deployed or local version of the application `npm start` as outlined above
  2. Upload JSON files containing an array of object literals like the example below:
  ```
 
  [{
    title: 'The Lord of the Rings: The Fellowship of the Ring.',
    text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
  }]
  ```
  3. Click on `Create Index` button after uploading and you will see a table containing mapped words and their document location
  4. Use the search bar on the right side of the app display layout to perform search operations. 


## Technology 
  1. HTML5
  2. Javascript (ES6)
  3. CSS3
  4. Jasmine to run the test
  5. AngularJS


## Testing 
- After setting up the local version of the application, run `jasmine` to run test

## Preview
![project screenshot](https://cp-inverted-index.herokuapp.com/assets/img/ss1.png "Inverted Index Preview")

### After upload
![project screenshot](https://cp-inverted-index.herokuapp.com/assets/img/ss2.png "Inverted Index Preview")
Link: http://cp-inverted-index.herokuapp.com/

Inspired By
TIA 

Copyright (c) 2017 Akinrele Oluwasinmisola
