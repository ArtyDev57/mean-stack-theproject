const express = require('express');

const Post = require('../models/post');

const router = express.Router();

router.post('', (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({
    _id: req.params.id
  }, post).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Updated Seccessfully"
    });
  });
});

router.get('', (req, res, next) => {
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

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: "Not Found"
      })
    }
  });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then((result) => {
    res.status(200).json({
      message: "Deleted Seccessfully"
    });
    console.log(result)
  });

});

module.exports = router;