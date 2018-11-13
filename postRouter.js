const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const ObjectID = require('mongodb').ObjectID;

const {Posts} = require('./models');
const {User} = require('./user/models');

// GET request for posts
router.get('/', (req, res) => {
  Posts.find()
    .then(posts => {
      res.json(posts.map(post => {
        return {
          id: post._id,
          hikename: post.hikename,
          user: post.user ? post.user.username: 'unknown',
          openseats: post.openseats,
          content: post.content,
          date: post.date
        }
      }))
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Something went wrong'})
    })
});

// GET request for post by id
router.get('/:id', (req, res) => {
  Posts.find()
    .then(posts => {
      res.json(posts.map(post => {
        return {
          id: post._id,
          hikename: post.hikename,
          user: post.user ? post.user.username: 'unknown',
          openseats: post.openseats,
          content: post.content,
          date: post.date
        }
      }))
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Something went wrong'})
    })
});

// POST for posts
router.post('/', (req, res) => {
  const requiredFields = ['hikename', 'openseats', 'content', 'user_id'];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  });

  User
    .findById(req.body.user_id)
});