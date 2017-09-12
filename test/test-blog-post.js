'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);
const should = chai.should();

describe('blog-post', function(){
  
  before(function(){          // before(runServer);
    return runServer();
  });

  after(function(){           // after(closeServer);
    return closeServer();
  });

  it('should list blog posts on GET', function() {
    return chai.request(app)
      .get('/blog-post')
      .then(function(res) {               // status, array, json in body, fields in body 
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        const expectedKeys = ['title', 'content', 'author', 'publishDate', 'id'];
        res.body.forEach(function(item){
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  it('should add blog post on POST', function(){
    const newPost = {title: 'New Title', content: 'new post text', author: 'bjb'};
    return chai.request(app)
      .post('/blog-post')
      .send(newPost)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        const expectedKeys = ['title', 'content', 'author', 'publishDate', 'id'];
        res.body.should.include.keys(expectedKeys);
        res.body.should.not.be.null;                    // unnecessary - pvs step would accomplish this
                                                        // check publishDate:  should be between datestamp before and after
        res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate}));
      });
  });

  it('should modify existing post on PUT', function(){
    const modPost = {title: 'Modified Title', content: 'modified content', author: 'bjb-prime'};    
    return chai.request(app)
      .get('/blog-post')
      .then(function(res){
        modPost.id = res.body[0].id;
        console.log('post id = ' + modPost.id);
        console.log(modPost);
        return chai.request(app)
          .put(`/blog-post/${modPost.id}`)
          .send(modPost);
      })
      .then(function(res){
        res.should.have.status(204);
        // res.body.should.be.a('object');                        router does not return body, these steps do nothing
        // res.body.should.not.be.null;
      });
  });

  it('should remove post on DELETE', function(){
    return chai.request(app)
      .get('/blog-post')
      .then(function(res){
        return chai.request(app)
          .delete(`/blog-post/${res.body[0].id}`);
      })
      .then(function(res){
        res.should.have.status(204);
      });
  });

});