const express = require('express');
const router = express.Router();

const webRoute = require('../routes/webRoute');

router.use("", webRoute);

module.exports = router;
