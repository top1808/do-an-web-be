const dayjs = require('dayjs');

const removeDiacritics = require('diacritics').remove; // Using the diacritics library

const generateID = () => {
  return Math.floor(Math.random() * Math.pow(10, 21)).toString();
};

const removeDiacriticsFromString = (text) => {
  return removeDiacritics(text);
}

const formatDateString = (date) => {
  return dayjs(date || new Date()).format('YYYY-MM-DD');
}

const formatDateTimeString = (date) => {
  return dayjs(date || new Date()).format('YYYY-MM-DD HH:mm');
}

module.exports = {
    generateID,
    removeDiacriticsFromString,
    formatDateString,
    formatDateTimeString,
}
