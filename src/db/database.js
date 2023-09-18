let mongoose = require('mongoose');
require('dotenv').config();

const mongodb_url = process.env.MONGO_DB_URL;

class Database {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(mongodb_url, {useNewUrlParser: true, useUnifiedTopology: true})
            .then(() => {
                console.log("Database connection successfully!");
            })
            .catch(err => {
                console.log("Database connection error!", err);
            })
    }
}

module.exports = new Database();
