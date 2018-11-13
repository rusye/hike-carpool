const uuid = require('uuid');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {User} = require('./user/models');

const postSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  hikename: {type: String, required: true},
  openseats: {type: Number, required: true},
  content: {type: String, required: true},
  date: {type: Date, default: Date.now()}
});

postSchema.pre('find', function(next) {
  this.populate('user');
  next();
});

postSchema.pre('findById', function(next) {
  this.populate('user');
  next();
});

postSchema.methods.serialize = function() {
  return {
    id: this._id,
    user: this.name,
    hikename: this.hikename,
    openseats: this.openseats,
    content: this.content,
    date: this.date
  };
};

const Posts = mongoose.model('posts', postSchema);

module.exports = {Posts};