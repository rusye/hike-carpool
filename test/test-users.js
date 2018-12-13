'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');
const {TEST_DATABASE_URL, PORT} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

function tearDownDb () {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
};

const databaseUrl = TEST_DATABASE_URL;
const port = PORT;

describe('/api/user', function() {
  const username = faker.internet.userName();
  const password = faker.internet.password();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email();
  const posts = []

  const usernameB = faker.internet.userName();
  const passwordB = faker.internet.password();
  const firstNameB = faker.name.firstName();
  const lastNameB = faker.name.lastName();
  const emailB = faker.internet.email();

  before(function() {
    return runServer(databaseUrl)
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('/api/users', function() {
    describe('POST', function() {
      it('Should reject users with missing username', function() {
        return chai.request(app).post('/api/users')
          .send({
            password,
            firstName,
            lastName
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
      });

      it('Should reject users with missing password', function() {
        return chai.request(app).post('/api/users')
          .send({
            username,
            firstName,
            lastName
          })
          .then( res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('password');
          });
      });

      it('Should reject users with non-string username', function() {
        return chai.request(app).post('/api/users')
          .send({
            username: 1234,
            password,
            firstName,
            lastName
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Incorrect field type: expected string');
            expect(res.body.location).to.equal('username');
          });
      });

      it('Should reject users with non-string password', function() {
        return chai.request(app).post('/api/users')
          .send({
            username,
            password: 1234,
            firstName,
            lastName
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Incorrect field type: expected string');
            expect(res.body.location).to.equal('password');
          });
      });

      it('Should reject users with non-string firstName', function() {
        return chai.request(app).post('/api/users')
          .send({
            username,
            password,
            firstName: 1234,
            lastName
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Incorrect field type: expected string');
            expect(res.body.location).to.equal('firstName');
          });
      });

      it('Should reject users with non-string lastName', function() {
        return chai.request(app).post('/api/users')
          .send({
            username,
            password,
            firstName,
            lastName: 1234
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Incorrect field type: expected string');
            expect(res.body.location).to.equal('lastName');
          });
      });

      it('Should reject users with non-trimmed username', function() {
        return chai.request(app).post('/api/users')
          .send({
            username: ` ${username} `,
            password,
            firstName,
            lastName
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Cannot start or end with whitespace');
            expect(res.body.location).to.equal('username');
          });
      });

      it('Should reject users with non-trimmed password', function() {
        return chai.request(app).post('/api/users')
          .send({
            username,
            password: ` ${password} `,
            firstName,
            lastName
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Cannot start or end with whitespace');
            expect(res.body.location).to.equal('password');
          });
      });

      it('Should reject users with empty username', function() {
        return chai.request(app).post('/api/users')
          .send({
            username: '',
            password,
            firstName,
            lastName
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Must be at least 1 characters long')
            expect(res.body.location).to.equal('username');
          });
      });

      it('Should reject users with password less than 4 characters', function() {
        return chai.request(app).post('/api/users')
          .send({
            username,
            password: '123',
            firstName,
            lastName
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Must be at least 4 characters long');
            expect(res.body.location).to.equal('password');
          });
      });

      it('Should reject users with password greater than 72 characters', function() {
        return chai.request(app).post('/api/users')
          .send({
            username,
            password: new Array(73).fill('a').join(''),
            firstName,
            lastName
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Must be at most 72 characters long');
            expect(res.body.location).to.equal('password');
          });
      });

      it('Should reject users with duplicate username', function() {
        return User.create({
          username,
          password,
          firstName,
          lastName
        })
        .then(() => 
          chai.request(app).post('/api/users').send({
            username,
            password,
            firstName,
            lastName
          })
        )
        .then(res => {
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Username is already taken');
          expect(res.body.location).to.equal('username');
        })
      });

      it('Should create a new user', function() {
        return chai.request(app).post('/api/users')
          .send({
            username,
            password,
            firstName,
            lastName,
            email,
            posts
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'id',
              'username',
              'firstName',
              'lastName',
              'email',
              'posts'
            );
            expect(res.body.username).to.equal(username);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            expect(res.body.email).to.equal(email);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstName).to.equal(firstName);
            expect(user.lastName).to.equal(lastName);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });

      it('Should trim firstName and lastName', function() {
        return chai.request(app).post('/api/users')
          .send({
            username,
            password,
            firstName: ` ${firstName} `,
            lastName: ` ${lastName} `
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'id',
              'username',
              'firstName',
              'lastName',
              'posts'
            )
            expect(res.body.username).to.equal(username);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
          });
      });
    });
  });
});