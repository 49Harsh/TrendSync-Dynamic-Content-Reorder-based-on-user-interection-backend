const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const postRoutes = require('./routes/posts');
const videoRoutes = require('./routes/videos');

app.use('/api/posts', postRoutes);
app.use('/api/videos', videoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});