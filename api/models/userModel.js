const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
  email: {
    type: String,
    required: 'email is required',
    unique: true
  },
  password: {
    type: String,
    required: 'password is required'
  }
});

module.exports = mongoose.model('User', User);
