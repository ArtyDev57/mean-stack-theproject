const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require('./routes/posts');

mongoose.connect('mongodb://127.0.0.1:27017/meanstack', {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Connected");
  })
  .catch(() => {
    console.log("Failed");
  });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use('/api/posts', postsRoutes);

module.exports = app;
