(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _invertedIndex = require('./inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable func-names */
(function () {
  var app = angular.module('inverted-index', []).run(function ($rootScope) {
    $rootScope.Utils = {
      keys: Object.keys
    };
  });

  app.directive('uploadfile', function () {
    var obj = {
      restrict: 'A',
      require: '?ngModel',
      link: function link(scope, elem, attrs, ngModel) {
        if (!ngModel) {
          return;
        }
        elem.bind('change', function (event) {
          var isValid = event.target.files[0].name.indexOf('.json') > 0;
          if (!isValid) {
            Materialize.toast('Please upload a valid json file', 4000);
            return;
          }

          var reader = new FileReader();
          reader.onload = function (loadEvent) {
            scope.$apply(function () {
              var file = loadEvent.target.result;
              ngModel.$setViewValue({
                fileName: event.target.files[0].name,
                document: file
              });
            });
          };
          reader.readAsText(event.target.files[0]);
        });
      }
    };
    return obj;
  });

  app.controller('UploadFileController', ['$timeout', '$scope', function ($timeout, $scope) {
    var _this = this;

    this.fileObject = null;
    this.files = [];
    this.fileNames = [];
    this.indices = {};
    this.myIndex = new _invertedIndex2.default();
    this.selectedFiles = [];
    this.searchTerms = '';
    this.found = {};

    this.createIndex = function (fileIndex) {
      var fileName = this.fileNames[fileIndex];
      var file = this.files[fileIndex];
      var result = this.myIndex.createIndex(fileName, file);
      if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {
        this.indices[fileName] = result;
      } else {
        Materialize.toast(result);
      }
    };

    this.search = function () {
      var indices = this.selectedFiles.length ? this.selectedFiles : Object.keys(this.indices);
      this.searchTerms = this.searchTerms.replace(/[^A-Za-z0-9\s]/g, '').toLowerCase().split(' ');
      var result = this.myIndex.searchIndex(indices, this.searchTerms);
      this.found = result;
      this.searchTerms = '';
    };

    $scope.$watch('files.fileObject', function (newVal) {
      if (newVal) {
        try {
          var parsedFile = JSON.parse(newVal.document);
          parsedFile.map(function (file) {
            if (!file.title || !file.text) {
              throw new Error('format');
            }
          });
          _this.files.push(parsedFile);
          _this.fileNames.push(newVal.fileName);
        } catch (err) {
          if (err.message === 'format') {
            Materialize.toast('Please upload a properly formatted file', 4000);
          } else {
            Materialize.toast('Please upload a valid json file', 4000);
          }
        }
        _this.fileObject = null;
      }
    });
  }]);
})();

},{"./inverted-index":2}],2:[function(require,module,exports){
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
