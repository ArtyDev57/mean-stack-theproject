const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.post('/api/posts', (req, res, next) => {
  const post = req.body;
  res.status(201).json({
    message: "Added Seccessfully! "
  });
});

app.get('/api/posts', (req, res, next) => {
  console.log('Fetching...');
  const posts = [{
      id: '1',
      title: 'MEAN Stack Developer',
      content: 'MongoDB Express Node.js Angular'
    },
    {
      id: '2',
      title: 'Frontend Developer',
      content: 'Angular'
    },
  ];
  res.status(200).json({message: "Fetched Seccessfully!", posts: posts});
});

module.exports = app;
