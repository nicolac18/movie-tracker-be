const mongoose = require('mongoose');

const { Schema } = mongoose;

const Movie = new Schema({
  tmdb_id: {
    type: String,
    required: 'tmdb_id is required',
    unique: true,
  },
  thumb: {
    type: String,
  },
  library: {
    type: Boolean,
  },
  watched: {
    type: Date,
    default: null,
  },
  wishlist: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Movie', Movie);
