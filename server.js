'use strict';

const express = require('express');
const bPostRouter = require('./bPostRouter');
const morgan = require('morgan');
const {BlogPosts} = require('./models');

const app = express();

// log http
app.use(morgan('common'));

app.use('/blog-post', bPostRouter);

app.get('/', (req, res) => {
  console.log('running get w only /');
  res.sendFile(__dirname + '/views/index.html');
});

console.log('adding dummy data');

const bp1 = {
  title: "My first blog post",
  content: "This is my first blog post.",
  author: "giri"
};

const bp2 = {
  title: "My second blog post",
  content: "This is my second blog post",
  author: "giri"
};

BlogPosts.create(bp1.title, bp1.content, bp1.author);
BlogPosts.create(bp2.title, bp2.content, bp2.author);

let {title, content, author} = bp1;               // better way would be to put qs in array and loop
BlogPosts.create(title, content, author);         //     would allow using let{ ... } with both
({title, content, author} = bp2);                 // parens force this to be interpreted as an expression
BlogPosts.create(title, content, author);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err);
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('closing server');
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports(app, runServer, closeServer);
