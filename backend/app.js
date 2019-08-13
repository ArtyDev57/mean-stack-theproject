const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Added Seccessfully!",
      postId: createdPost._id
    });
  });
});

app.get('/api/posts', (req, res, next) => {
  console.log('Fetching...');
  Post.find().then(posts => {
    res.status(200).json({
      message: "Fetched Seccessfully!",
      posts: posts
    });
  }).catch(() => {
    console.log("Error");
  });

});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then((result) => {
    res.status(200).json({message: "Deleted Seccessfully"});
    console.log(result)
  });
  
});

module.exports = app;
