const { initializeApp, cert } = require("firebase-admin/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const serviceAccount = require("../../firebase.json");

const firebase = initializeApp({
  credential: cert(serviceAccount),
});

module.exports = firebase;
