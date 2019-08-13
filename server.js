const express = require('express');
const mongoose = require('./config/database');
const { EXPRESS_PORT } = require('./config/app');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(EXPRESS_PORT, () => console.log(`Ready on port ${EXPRESS_PORT}!`));