const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const protect = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const { rawg_game_id, rating, opinion, recommended, platform_played } = req.body;

    const newReview = new Review({
      rawg_game_id,
      user: req.user,
      rating,
      opinion,
      recommended,
      platform_played
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'username');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/my-reviews', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user }).populate('user', 'username');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/game/:rawg_game_id', protect, async (req, res) => {
  try {
    const { rawg_game_id } = req.params;
    const reviews = await Review.find({ rawg_game_id }).populate('user', 'username');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const { opinion, rating, platform_played, recommended } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { opinion, rating, platform_played, recommended },
      { new: true }
    );

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
