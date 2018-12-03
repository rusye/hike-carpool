'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const ObjectID = require('mongodb').ObjectID;
const passport = require('passport');

const {Posts} = require('./models');
const {User} = require('./users/models');

// GET request for posts
router.get('/', (req, res) => {
  Posts.find()
  .populate('user')
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
  Posts.findById(req.params.id)
  .populate('user')
    .then(post => {
      res.json({
          id: post._id,
          hikename: post.hikename,
          user: post.user ? post.user.username: 'unknown',
          openseats: post.openseats,
          content: post.content,
          date: post.date
      });
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

  let postId = '';

  User
    .findById(req.body.user_id)
    .then(user => {
      if (user) {
        Posts
          .create({
            user: ObjectID(req.body.user_id),
            hikename: req.body.hikename,
            openseats: req.body.openseats,
            content: req.body.content,
            date: req.body.date
          })
          .then(post => {
            // console.log(post._id);
            postId = `${post._id}`;
            console.log(postId);
            nextStep();
            // user.posts.push(post);
            // user.save();
            res.status(201).json({
              id: post.id,
              user: user.username,
              hikename: post.hikename,
              openseats: post.openseats,
              content: post.content,
              date: post.date
            })
          })
          // .then(post => {
          //   console.log(JSON.stringify(post));
            // user.posts.push(post);
            // user.save();
          // })
          .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Something went wrong'});
          });
      }
      else {
        const message = 'User not found';
        console.error(message);
        return res.status(400).send(message);
      }
    })
    
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Something went wrong'});
    });

  function nextStep() {
    User.findByIdAndUpdate(
    req.body.user_id, 
    {$push: {posts: `ObjectID(${postId})`}},
    {safe: true, upsert: true, new : true},
    function(err, model) {
      console.log(err);
      })
  };
});

// PUT request for posts
router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({message: `ID's do not match`});
  }

  const toUpdate = {};
  const updateableFields = ['hikename', 'openseats', 'content'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Posts
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

router.delete('/:id', (req, res) => {
  Posts
    .findByIdAndRemove(req.params.id)
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({message: "Internal server error"}));
});

module.exports = router;