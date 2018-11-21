'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {Posts} = require('../models');
const {User} = require('../users/models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedPostData() {
  console.info('seeding post data')
  const seedData = [];

  for (let i=1; i<10; i++) {
    seedData.push(generatePostData())
  }
  return Posts.insertMany(seedData);
};

function generatePostData() {
  return {
    username: faker.internet.userName(),
    hikename: faker.lorem.words(),
    openseats: faker.random.number(),
    content: faker.lorem.sentence()
  };
};

function generateUserData() {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email()
  };
};

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
};

describe('Hike Posts API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedPostData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });


  describe('got into the function', function() {
    it('Should display the home page', function() {
      return chai.request(app).get('/')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });
  });

  describe('GET endpoint', function() {
    it('Should return all existing posts', function() {
      let res;
      return chai.request(app).get('/posts')
        .then(_res => {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf.at.least(1);
          return Posts.count();
        })
        .then(count => {
          expect(res.body).to.have.lengthOf(count);
        });
    });

    it('Should return posts with the right fields', function() {
      let resPost;
      return chai.request(app).get('/posts')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);

          res.body.forEach(post => {
            expect(post).to.be.a('object')
            expect(post).to.include.keys(
              'id', 'user', 'hikename', 'openseats', 'content', 'date');
          });
          resPost = res.body[0];
          return Posts.findById(resPost.id);
        })
        .then(post => {
          expect(resPost.id).to.equal(post.id);
          expect(resPost.username).to.equal(post.username);
          expect(resPost.hikename).to.equal(post.hikename);
          expect(resPost.openseats).to.equal(post.openseats);
          expect(resPost.content).to.equal(post.content);
        });
    });
  });

  describe('POST endpoint', function() {
    it('Should add a new post', function() {
      const newUser = generateUserData();
      // return User.create(newUser);

      

      // console.log(JSON.stringify(newUser));
      return chai.request(app).post('/api/users').send(newUser)
        .then(userData => {
          let newPost = {
            user_id: userData.body.id,
            user: newUser.username,
            hikename: faker.lorem.words(),
            openseats: faker.random.number(),
            content: faker.lorem.sentence()
          };
          // console.log(userData.body.id);
          // newPost.user_id = userData.text.id;
          return chai.request(app).post('/posts').send(newPost)
            .then(res => {
              expect(res).to.have.status(201);
              expect(res).to.be.json;
              expect(res.body).to.be.a('object');
              expect(res.body).to.include.keys(
                'id', 'user', 'hikename', 'openseats', 'content', 'date');
              expect(res.body.id).to.not.be.null;
              expect(res.body.hikename).to.equal(newPost.hikename);
              expect(res.body.openseats).to.equal(newPost.openseats);
              expect(res.body.content).to.equal(newPost.content);
              return Posts.findById(res.body.id);
            })
            .then(post => {
              expect(post.username).to.equal(newPost.username);
              expect(post.hikename).to.equal(newPost.hikename);
              expect(post.openseats).to.equal(newPost.openseats);
              expect(post.content).to.equal(newPost.content)
            });
        })
    });
  });

  describe('PUT endpoint', function() {
    it('Should update fields you send over', function() {
      const updateData = {
        hikename: 'that one tough hike',
        openseats: 2,
        content: 'pink, pink, pink, pink'};

      return Posts.findOne()
        .then(post => {
          updateData.id = post.id;

          return chai.request(app)
          .put(`/posts/${updateData.id}`)
          .send(updateData)
        })
        .then(res => {
          expect(res).to.have.status(204);
          return Posts.findById(updateData.id)
        })
        .then(post => {
          expect(post.hikename).to.equal(updateData.hikename);
          expect(post.openseats).to.equal(updateData.openseats);
          expect(post.content).to.equal(updateData.content)
        });
    });
  });

  describe('DELETE endpoint', function() {
    it('Should delete a post by id', function() {
      let post;
      return Posts.findOne()
        .then(_post => {
          post = _post;
          return chai.request(app).delete(`/posts/${post.id}`);
        })
        .then(res => {
          expect(res).to.have.status(204);
          return Posts.findById(post.id);
        })
        .then(_post => {
          expect(_post).to.be.null;
        });
    });
  });
});