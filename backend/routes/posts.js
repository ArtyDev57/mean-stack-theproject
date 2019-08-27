const express = require('express');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

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

router.post('', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userdata.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Added Seccessfully!",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  }).catch(err => {
    res.status(500).json({
      message: 'Something Went Wrong, I Can Feel It (C)'
    });
  });
});

router.put('/:id', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userdata.userId
  });
  Post.updateOne({
    _id: req.params.id,
    creator: req.userdata.userId
  }, post).then((result) => {
    if (result.nModified > 0) {
      res.status(200).json({
        message: "Updated Seccessfully",
      });
    } else {
      res.status(401).json({
        message: "Updated Failed",
      });
    }
  }).catch(err => {
    res.status(500).json({
      message: 'Something Went Wrong, I Can Feel It (U)'
    });
  });
});

router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery.then(posts => {
    fetchedPosts = posts;
    return Post.countDocuments();
  })
  .then(count => {
    res.status(200).json({
      message: "Fetched Seccessfully!",
      posts: fetchedPosts,
      maxPosts: count
    });
  })
  .catch(() => {
    res.status(500).json({
      message: 'Something Went Wrong, I Can Feel It (R)'
    });
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
  }).catch(err => {
    res.status(500).json({
      message: 'Something Went Wrong, I Can Feel It (R)'
    });
  });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userdata.userId
  }).then((result) => {
    if (result.deleteCount > 0) {
      res.status(200).json({
        message: "Deleted Seccessfully"
      });
    } else {
      res.status(401).json({
        message: "Deleted Failed"
      });
    }
  }).catch(err => {
    res.status(500).json({
      message: 'Something Went Wrong, I Can Feel It (D)'
    });
  });

});

module.exports = router;