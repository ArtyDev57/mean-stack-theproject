const Post = require('../models/post');
 
 exports.createPost = (req, res, next) => {
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
 };

 exports.updatePost = (req, res, next) => {
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
     if (result.n > 0) {
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
 };

 exports.getPosts = (req, res, next) => {
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

 };

 exports.getPost = (req, res, next) => {
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
 };

 exports.deletePost = (req, res, next) => {
   Post.deleteOne({
     _id: req.params.id,
     creator: req.userdata.userId
   }).then((result) => {
     if (result.n > 0) {
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

 }
