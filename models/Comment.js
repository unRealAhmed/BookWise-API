const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  // Text of the comment
  text: {
    type: String,
    required: [true, 'Text is required for a comment.'],
    maxlength: [500, 'Comment text cannot exceed 500 characters'],
  },

  // Author information
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      required: [true, 'Username of the author is required.'],
    },
  },

  // Book information associated with the comment
  book: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    title: {
      type: String,
      required: [true, 'Title of the associated book is required.'],
    },
  },

  // Date the comment was created
  date: {
    type: Date,
    default: Date.now,
  },
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

commentSchema.index({ author: 1, book: 1 });

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'name',
  }).select('-updatedAt');
  next();
});


const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment
