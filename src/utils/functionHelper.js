const dayjs = require("dayjs");

const removeDiacritics = require("diacritics").remove;

const generateID = () => {
  return Math.floor(Math.random() * Math.pow(10, 21)).toString();
};

const generateBarcode = () => {
  return Math.floor(Math.random() * Math.pow(10, 12)).toString();
};

const removeDiacriticsFromString = (text) => {
  return removeDiacritics(text);
};

const formatDateString = (date) => {
  return dayjs(date || new Date()).format("YYYY-MM-DD");
};

const formatDateStringRender = (date) => {
  return dayjs(date || new Date()).format("DD/MM/YYYY");
};

const formatDateTimeString = (date) => {
  return dayjs(date || new Date()).format("YYYY-MM-DD HH:mm");
};

const formatDateTimeStringRender = (date) => {
  return dayjs(date || new Date()).format("DD/MM/YYYY HH:mm");
};

const addElementToArrayUnique = (array = [], element) => {
  if (!array.includes(element)) {
    array.push(element);
  }
  return array;
};

const getListDateFromStartToEnd = (startDate, endDate) => {
  if (!startDate || !endDate) return [];
  startDate = dayjs(startDate).format("YYYY-MM-DD");
  endDate = dayjs(endDate).format("YYYY-MM-DD");

  const dates = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = dayjs(currentDate).add(1, "day").format("YYYY-MM-DD");
  }
  return dates;
};

const customMoney = (money) => {
	return (money || 0)?.toLocaleString('vi-VN', {
		style: 'currency',
		currency: 'VND',
	});
};

module.exports = {
  getListDateFromStartToEnd,
  generateID,
  generateBarcode,
  removeDiacriticsFromString,
  formatDateString,
  formatDateStringRender,
  formatDateTimeString,
  addElementToArrayUnique,
  formatDateTimeStringRender,
  customMoney
};
