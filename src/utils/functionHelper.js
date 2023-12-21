const removeDiacritics = require('diacritics').remove; // Using the diacritics library

const generateID = () => {
  return Math.floor(Math.random() * Math.pow(10, 21)).toString();
};

function removeDiacriticsFromString(text) {
  return removeDiacritics(text);
}

module.exports = {
    generateID,
    removeDiacriticsFromString
}
