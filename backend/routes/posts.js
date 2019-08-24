const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = new Error('Invalid MIME type'); 
    if (isValid) {
      err = null;
    }
    callback(err, 'backend/images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Added Seccessfully!",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  });
});

router.put('/:id', multer({storage: storage}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
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