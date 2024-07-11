const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Create a new post
router.post('/', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all posts, sorted by score
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ score: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get related posts by category
router.get('/related', async (req, res) => {
  try {
    const { category } = req.query;
    const relatedPosts = await Post.find({ category }).sort({ score: -1 }).limit(5);
    res.json(relatedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Handle post interactions (view, like, comment)
router.post('/:id/interact', async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    console.log('Interaction request:', { id, type });

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    switch (type) {
      case 'view':
        post.interactions.views += 1;
        break;
      case 'like':
        post.interactions.likes += 1;
        break;
      case 'comment':
        post.interactions.comments += 1;
        break;
      default:
        return res.status(400).json({ message: 'Invalid interaction type' });
    }

    // Recalculate score
    post.score = post.interactions.views + 
                 post.interactions.likes * 5 + 
                 post.interactions.comments * 10;

    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Error in interaction:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get post score
router.get('/:id/score', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ score: post.score });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;