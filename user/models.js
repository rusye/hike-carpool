'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: string, required: true},
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},
  email: String
});

userSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    email: this.email
  };
};

let User = mongoose.model('user', userSchema);

module.exports = {User};