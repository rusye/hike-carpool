'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');
const {JWT_SECRET} = require('../config');
const {TEST_DATABASE_URL, PORT} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

const databaseUrl = TEST_DATABASE_URL;
const port = PORT;

describe('Protected endpoint', function() {
  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'Example';
  const lastName = 'User';

  before(function() {
    return runServer(databaseUrl);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password, 
        firstName, 
        lastName
      })
    );
  });

  afterEach(function() {
    return User.remove({});
  });

  describe('/api/protected', function() {
    it('Should reject requests with no credentials', function() {
      return chai
        .request(app)
        .get('/api/protected')
        .then(res =>
          expect(res).to.have.status(401));
    });

    it('Should reject requests with an invalid token', function() {
      const token = jwt.sign(
        {
          username, 
          firstName, 
          lastName
        },
        'wrongSecret',
        {
          algorithm: 'HS256',
          expiresIn: '7d'
        }
      );

      return chai
        .request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${token}`)
        .then(res => 
          expect(res).to.have.status(401));
    });

    it('Should reject requests with an expired token', function() {
      const token = jwt.sign(
        {
          user: {
            username,
            firstName, 
            lastName
          },
          exp: Math.floor(Date.now() / 1000) - 10
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username
        }
      );

      return chai
        .request(app)
        .get('/api/protected')
        .set('authorization', `Bearer ${token}`)
        .then(res =>
          expect(res).to.have.status(401));
    });

    it('Should send protected data', function() {
      const token = jwt.sign(
        {
          user: {
            username,
            firstName,
            lastName
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );

      return chai
        .request(app)
        .get('/api/protected')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.equal('rosebud');
        });
    });
  });
});