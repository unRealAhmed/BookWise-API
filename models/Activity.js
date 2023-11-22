const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  // Book Information
  info: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, 'Book ID is required.'],
    },
    title: {
      type: String,
      required: [true, 'Title of the book is required.'],
    },
  },

  // Category of the activity
  category: {
    type: String,
    required: [true, 'Category is required.'],
  },

  // Time information associated with the activity
  time: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
    },
    returnDate: Date,
    issueDate: Date,
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

  // Fine details
  fine: {
    amount: Number,
    date: Date,
  },

  // Entry time of the activity
  entryTime: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Activity", activitySchema);
