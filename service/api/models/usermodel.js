'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  username: {
    type: String,
    required: 'Kindly enter the username'
  },
  password: {
    type: String,
    required: 'Kindly enter the password'
  },
  rank: {
    type: Number,
    required: 'Kindly enter the rank'    
  }
});

module.exports = mongoose.model('Users', UserSchema);