'use strict';

const express = require('express');
const passport = require('passport');

const {User} = require('./models');
const {Posts} = require('../models');

const router = express.Router();

const {router: localStrategy, jwtStrategy} = require('../auth');
passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', {session: false});

// Post to register a new user
router.post('/', (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedFields = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedFields) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedFields
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 4,
      max: 72
    }
  };
  
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] && 
        req.body[field].trim().length < sizedFields[field].min
  );

  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] && 
        req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName = '', lastName = '', email} = req.body;
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username is already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        lastName,
        email
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      console.log(err);
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

// GET request for post by id
router.get('/:id', jwtAuth, (req, res) => {
  User.findById(req.params.id)
  .populate('posts')
  .then(user => {
    res.json({
    id: user._id,
    username: user.username || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email,
    posts: user.posts
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: 'Internal server error' + err});
  })
});

module.exports = {router};