const express = require('express');
const mongoose = require('./config/database');
const passport = require('./config/passport');
const bodyParser = require('body-parser');
const { EXPRESS_PORT } = require('./config/app');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./routes'));
app.listen(EXPRESS_PORT, () => console.log(`Ready on port ${EXPRESS_PORT}!`));