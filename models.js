const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {User} = require('./users/models');

function local() {
  let d = new Date(Date(2012, 11, 20, 3, 0, 0));
  let local = d.toLocaleString('en-US');
  return local;
};

const postSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  hikename: {type: String, required: true},
  openseats: {type: Number, required: true},
  content: {type: String, required: true},
  date: {type: String, default: local}
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

const Posts = mongoose.model('Posts', postSchema);

module.exports = {Posts};