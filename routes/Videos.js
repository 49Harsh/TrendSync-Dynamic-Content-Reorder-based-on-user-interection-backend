const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/related', async (req, res) => {
  try {
    const { category } = req.query;
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: 'snippet',
        q: category,
        type: 'video',
        maxResults: 5,
        key: process.env.YOUTUBE_API_KEY
      }
    });
    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title
    }));
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;