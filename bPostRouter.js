'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router();
const {BlogPosts} = require('./models');

router.get('/', (req, res) => {
  console.log('running get in router module');
  res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
  console.log('running posts');
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++){
    if (!(requiredFields[i] in req.body)){
      const message = `Missing ${requiredFields[i]}`;
      return res.status(400).json({message});                 // send as json
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  console.log('running post'
  );
  console.log(item);
  res.status(201).json(item);
});

router.put('/:id', jsonParser, (req, res) => {
  console.log('running put');
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++){
    if (!(requiredFields[i] in req.body)){
      const message = `Missing ${requiredFields[i]}`;
      return res.status(400).send(message);
    }
  }
  if (!BlogPosts.posts.find(item => {                               // pass everything to .update()
    item.id === req.params.id;                                      // use try/catch to manage exceptions
  })){
    return res.status(400).send('id is not matching');
  }
  BlogPosts.update({id: req.body.id, title: req.body.title, content: req.body.content, author: req.body.author});
  console.log('updated');
  res.status(204).end();
});

router.delete('/:id', (req, res) => {
  if (!BlogPosts.posts.find(item => {
    item.id === req.params.id;
  })){
    return res.status(400).send('id is not matching');
  }
  BlogPosts.delete(req.params.id);                                  // delete ignores bad id
  console.log(`deleted  item ${req.params.id}`);
  res.status(204).end();
});

module.exports = router;      // try to use the new method