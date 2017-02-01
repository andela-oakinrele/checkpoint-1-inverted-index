(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _invertedIndex = require('../src/inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var books = {
  correct: [{
    title: 'Alice in Wonderland',
    text: 'Alice falls into a rabbit hole and enters a world full of imagination.'
  }, {
    title: 'The Lord of the Rings: The Fellowship of the Ring.',
    text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
  }],
  wrong: [{
    name: 'Alice in Nigeria',
    text: 'Alice went to Ikeja City Mall.'
  }, {
    name: 'The Lord of the Rings: The Fellowship of the Ring.',
    text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
  }],
  newdoc: [{
    title: 'Simisola Akinrele',
    text: 'Lives in Nigeira.'
  }, {
    title: 'Andela',
    text: 'Become a world class developer at Andela.'
  }]
};

describe('Test suite for Inverted Index', function () {
  var index = new _invertedIndex2.default();
  var myIndex = index.createIndex('books.json', books.correct);
  index.createIndex('newfile.json', books.newdoc);
  describe('Read book data', function () {
    it('Should confirm that the file is a JSON file', function () {
      expect(index.validateDoc(books.correct)).toBe(true);
      expect(index.validateDoc(books.wrong)).toBe(false);
    });
    it('Should confirm that the JSON file is not Empty', function () {
      expect(index.validateDoc(books.correct)).toBe(true);
    });
    it('Should ensure each object in JSON array\n        contains a property whose value is a string.\n        ', function () {
      expect(index.validateDoc(books.correct)).toBe(true);
    });
  });

  describe('Populate Index', function () {
    var mykeys = Object.keys(myIndex);
    it('Should ensure index is created once JSON file has been read', function () {
      expect(typeof myIndex === 'undefined' ? 'undefined' : _typeof(myIndex)).toBe('object');
      expect(Array.isArray(myIndex)).toBe(false);
    });
    it('Should ensure index is correct.', function () {
      expect(myIndex.alice).toEqual([0]);
      expect(myIndex.a).toEqual([0, 1]);
      expect(myIndex.a).not.toEqual([2]);
    });
    it('Should ensure each object in JSON array \n        contains a property whose value is a string.', function () {
      mykeys.forEach(function (doc) {
        expect(typeof doc === 'undefined' ? 'undefined' : _typeof(doc)).toBe('string');
      });
    });

    it('Should ensure index is not overwritten by a new JSON file.', function () {
      expect(Array.isArray(index.indices['books.json'])).toBe(false);
      expect(Array.isArray(index.indices['newfile.json'])).toBe(false);
      expect(_typeof(index.indices['books.json'])).toBe('object');
      expect(_typeof(index.indices['newfile.json'])).toBe('object');
    });
  });

  describe('Search Index', function () {
    var searchResult = index.searchIndex(['books.json'], 'a');
    it('Should ensure index returns the correct results when searched.', function () {
      expect(searchResult.a['books.json']).toEqual([0, 1]);
    });
    var arrayResult = index.searchIndex(['books.json'], ['unusual', 'alice']);
    it('Should ensure searchIndex can handle an array of search terms.', function () {
      expect(arrayResult.unusual['books.json']).toEqual([1]);
      expect(arrayResult.alice['books.json']).toEqual([0]);
    });
    var variedResult = index.searchIndex(['books.json'], 'the', 'lord', 'man');
    it('Should ensure searchIndex can handle \n        a varied number of search terms as arguments.', function () {
      expect(variedResult.the['books.json']).toEqual([1]);
      expect(variedResult.lord['books.json']).toEqual([1]);
      expect(variedResult.man['books.json']).toEqual([1]);
    });
    it('Should ensure search does not take too long to execute.', function () {
      var start = Date.now();
      index.searchIndex(['books.json'], 'alice', 'the', 'man');
      var end = Date.now();
      var final = end - start;
      expect(final).toBeLessThan(0.5);
    });
    it('Should ensure searchIndex goes through all indexed files if a filename \n        is not passed, i.e filename argument should be made optional', function () {
      var searchall = index.searchIndex(null, 'the', 'lord', 'man');
      expect(searchall.the['books.json']).toEqual([1]);
      expect(searchall.lord['books.json']).toEqual([1]);
      expect(searchall.man['books.json']).toEqual([1]);
    });
  });

  describe('Get Index', function () {
    it('Should ensure getIndex method takes a string\n     argument that specifies the location of the JSON data.', function () {
      var search = index.getIndex('books.json');
      expect(Array.isArray(search)).toBe(false);
      expect(typeof search === 'undefined' ? 'undefined' : _typeof(search)).toBe('object');
    });
  });
});

},{"../src/inverted-index":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class InvertedIndex
 */
var InvertedIndex = function () {
  /**
   * @constructor
   */
  function InvertedIndex() {
    _classCallCheck(this, InvertedIndex);

    this.indices = [];
    this.errorMessage = '';
  }

  /**
   * GetIndex
   * *
   * Gets the index of the files uploaded
   * *
   * @param {any} filename
   * @returns {any} void
   */


  _createClass(InvertedIndex, [{
    key: 'getIndex',
    value: function getIndex(filename) {
      return this.indices[filename];
    }

    /**
     * validateDoc
     * *
     * Checks that the uploaded file is valid
     * *
     * @param {any} parseDoc
     * @returns {boolean} result
     * @memberOf InvertedIndex
     */

  }, {
    key: 'validateDoc',
    value: function validateDoc(parseDoc) {
      var isJSONObject = (typeof parseDoc === 'undefined' ? 'undefined' : _typeof(parseDoc)) === 'object';
      var isNotEmpty = parseDoc.length > 0;
      if (!isNotEmpty) {
        this.errorMessage = 'the file is empty';
      }
      var isValidStructure = true;
      parseDoc.map(function (file) {
        if (!file.title || typeof file.title !== 'string' || !file.text || typeof file.text !== 'string') {
          isValidStructure = false;
        }
      });
      if (!isValidStructure) {
        this.errorMessage = 'the file structure is invalid';
      }

      return isJSONObject && isNotEmpty && isValidStructure;
    }

    /**
     * Create index
     * *
     * Create index takes single document param
     * and builds an index from it
     * *
     * @param {any} filename
     * @param {any} parseDoc
     * @returns {any} result
     */

  }, {
    key: 'createIndex',
    value: function createIndex(filename, parseDoc) {
      var index = {};
      if (this.validateDoc(parseDoc)) {
        parseDoc.map(function (sentence, position) {
          (sentence.title + ' ' + sentence.text).cleanDoc().map(function (word) {
            if (index[word] && index[word].indexOf(position) === -1) {
              index[word].push(position);
            } else {
              index[word] = [position];
            }
          });
        });
        this.indices[filename] = index;
        return index;
      }
      return this.errorMessage;
    }

    /**
     * searchIndex
     * *
     * Searches key words from the files that has been uploaded
     * *
     * @param {any} filenames
     * @param {any} terms
     * @returns {object} Documents
     */

  }, {
    key: 'searchIndex',
    value: function searchIndex(filenames) {
      var _this = this;

      if (filenames !== null) {
        if (!this.validateFileNames(filenames)) {
          return 'filename does not exist';
        }
      }
      filenames = filenames || Object.keys(this.indices);
      var result = {};

      for (var _len = arguments.length, terms = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        terms[_key - 1] = arguments[_key];
      }

      var searchTerms = terms.flatten();
      searchTerms.forEach(function (searchTerm) {
        result[searchTerm] = {};
        filenames.forEach(function (index) {
          result[searchTerm][index] = _this.indices[index][searchTerm] ? _this.indices[index][searchTerm] : [];
        });
      });
      return result;
    }

    /**
     * validateFileNames
     * *
     * Checks if the filename actually exists
     * *
     * @param {Array} filenames
     * @returns {boolean} status
     * @memberOf InvertedIndex
     */

  }, {
    key: 'validateFileNames',
    value: function validateFileNames(filenames) {
      var _this2 = this;

      var status = true;
      filenames.forEach(function (filename) {
        if (!Object.keys(_this2.indices).includes(filename)) {
          status = false;
        }
      });
      return status;
    }
  }]);

  return InvertedIndex;
}();

exports.default = InvertedIndex;


Array.prototype.flatten = function flatten() {
  return this.toString().split(',').map(function (item) {
    return item.toLowerCase();
  });
};

String.prototype.cleanDoc = function cleanDoc() {
  return this.replace(/[^a-z0-9\s]/gi, '').toLowerCase().split(' ');
};

},{}]},{},[2,1]);
