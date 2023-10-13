const generateID = () => {
  return Math.floor(Math.random() * Math.pow(10, 21)).toString();
};

module.exports = {
    generateID
}
