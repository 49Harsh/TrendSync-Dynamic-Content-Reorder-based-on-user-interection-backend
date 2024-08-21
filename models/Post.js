const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    information: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    interactions: {
      views: {
        type: Number,
        default: 0,
        min: 0,
      },
      likes: {
        type: Number,
        default: 0,
        min: 0,
      },
      comments: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    score: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

PostSchema.pre('save', function (next) {
  this.score = this.interactions.views + this.interactions.likes * 5 + this.interactions.comments * 10;
  next();
});

PostSchema.methods.updateInteraction = function (type) {
  if (type in this.interactions) {
    this.interactions[type] += 1;
  }
};

module.exports = mongoose.model('Post', PostSchema);