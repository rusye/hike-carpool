'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

// const {app, runServer, closeServer} = require('../server');

const {app} = require('../server');

// Add one test that verifies that when you hit up the 
// root url for your client, you get a 200 status code and HTML.

const expect = chai.expect;

chai.use(chaiHttp);

describe('Root Level', function() {
  console.info('got into the function');
  it('should hit up the root url, and get status code 200 with html', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      })
  });
});

