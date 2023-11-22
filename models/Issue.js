const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  // Book Information
  book_info: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, 'Book ID is required.'],
    },
    title: {
      type: String,
      required: [true, 'Title of the book is required.'],
    },
    author: String,
    ISBN: String,
    category: String,
    stock: Number,
    issueDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    isRenewed: {
      type: Boolean,
      default: false,
    },
  },

  // User Information
  user_id: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'User ID is required.'],
    },
    username: {
      type: String,
      required: [true, 'Username of the user is required.'],
    },
  },
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue
