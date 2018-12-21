'use strict';

const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const passport = require('passport');

const {Posts} = require('./models');
const {User} = require('./users/models');

const {router: localStrategy, jwtStrategy} = require('./auth');
passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', {session: false});

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
router.post('/', jwtAuth, (req, res) => {
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
            user.posts.push(post._id);
            user.save();
            res.status(201).json({
              id: post.id,
              user: user.username,
              hikename: post.hikename,
              openseats: post.openseats,
              content: post.content,
              date: post.date
            })
          })
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
});

// PUT request for posts
router.put('/:id', jwtAuth, (req, res) => {
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

router.delete('/:id', jwtAuth, (req, res) => {
  Posts
    .findByIdAndRemove(req.params.id)
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({message: "Internal server error"}));
});

module.exports = router;