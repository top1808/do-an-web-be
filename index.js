const express = require('express');
const bodyParser = require('body-parser');

const Database = require('./src/db/database');
// const routes = require('./src/routes/controller');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoute = require('./src/routes/auth');
const userRoute = require('./src/routes/user');

require('dotenv').config();

const app = express();

app.use(cors())
app.use(cookieParser());
app.use(express.json());


app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({extended: true, limit: '30mb'}));

// Website routes
app.use('/v1/auth', authRoute);
app.use('/v1/user', userRoute);

app.listen(process.env.PORT, function () {
    console.log("Starting at port 8000...");
});
