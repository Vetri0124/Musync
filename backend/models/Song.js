const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  artist: {
    type: String,
    required: [true, 'Please add an artist'],
    trim: true,
    maxlength: [100, 'Artist cannot be more than 100 characters']
  },
  album: {
    type: String,
    trim: true,
    maxlength: [100, 'Album cannot be more than 100 characters']
  },
  genre: {
    type: String,
    trim: true
  },
  year: {
    type: Number,
    min: [1900, 'Year must be at least 1900'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  duration: {
    type: Number,
    required: true
  },
  audioFingerprint: {
    type: String,
    required: true,
    unique: true
  },
  coverImage: {
    type: String,
    default: 'default.jpg'
  },
  spotifyUrl: String,
  appleMusicUrl: String,
  youtubeUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create text index for search
SongSchema.index({ title: 'text', artist: 'text', album: 'text' });

module.exports = mongoose.model('Song', SongSchema);