const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  // Title of the book
  title: {
    type: String,
    required: [true, 'Title is required.'],
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },

  // International Standard Book Number
  ISBN: {
    type: String,
    required: [true, 'ISBN is required.'],
    unique: true,
    trim: true,
  },

  // Number of copies in stock
  stock: {
    type: Number,
    required: [true, 'Stock information is required.'],
    min: [0, 'Stock cannot be negative.'],
  },

  // Author of the book
  author: {
    type: String,
    required: [true, 'Author information is required.'],
    minlength: [3, 'Author name must be at least 3 characters long'],
    maxlength: [50, 'Author name cannot exceed 50 characters'],
  },

  // Description of the book
  description: {
    type: String,
    required: [true, 'Description is required.'],
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },

  // Category of the book
  category: {
    type: String,
    required: [true, 'Category is required.'],
    minlength: [3, 'Category must be at least 3 characters long'],
    maxlength: [50, 'Category cannot exceed 50 characters'],
  },
},
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

bookSchema.index({ title: 1, author: 1 });

// Virtual populate
bookSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'book',
  localField: '_id'
});

bookSchema.pre(/^findOne/, function (next) {
  this.populate({
    path: 'comments',
    select: '-__v'
  })
  next();
});


const Book = mongoose.model("Book", bookSchema);

module.exports = Book
