/**
 * @class InvertedIndex
 */
export default class InvertedIndex {
  /**
   * @constructor
   */
  constructor() {
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
  getIndex(filename) {
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
  validateDoc(parseDoc) {
    const isJSONObject = (typeof parseDoc === 'object');
    const isNotEmpty = parseDoc.length > 0;
    if (!isNotEmpty) {
      this.errorMessage = 'the file is empty';
    }
    let isValidStructure = true;
    parseDoc.map((file) => {
      if (!file.title ||
        typeof file.title !== 'string' ||
        !file.text ||
        typeof file.text !== 'string') {
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
  createIndex(filename, parseDoc) {
    const index = {};
    if (this.validateDoc(parseDoc)) {
      parseDoc.map((sentence, position) => {
        `${sentence.title} ${sentence.text}`
        .cleanDoc()
          .map((word) => {
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
  searchIndex(filenames, ...terms) {
    if (filenames !== null) {
      if (!this.validateFileNames(filenames)) {
        return 'filename does not exist';
      }
    }
    filenames = filenames || Object.keys(this.indices);
    const result = {};
    const searchTerms = terms.flatten();
    searchTerms.forEach((searchTerm) => {
      result[searchTerm] = {};
      filenames.forEach((index) => {
        result[searchTerm][index] = this.indices[index][searchTerm] ?
          this.indices[index][searchTerm] : [];
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
  validateFileNames(filenames) {
    let status = true;
    filenames.forEach((filename) => {
      if (!Object.keys(this.indices).includes(filename)) {
        status = false;
      }
    });
    return status;
  }
}

Array.prototype.flatten = function flatten() {
  return this.toString().split(',').map(item =>
    item.toLowerCase());
};

String.prototype.cleanDoc = function cleanDoc() {
  return this.replace(/[^a-z0-9\s]/gi, '')
    .toLowerCase()
    .split(' ');
};


// if (typeof module === 'object' && module.exports) {
//   module.exports = InvertedIndex;
// }
