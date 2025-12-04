const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rawg_game_id: {
    type: Number,
    required: true
  },
  game_name: {
    type: String,
    required: true
  },
  game_background_image: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform_played: {
    type: String
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  opinion: {
    type: String
  },
  recommended: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
