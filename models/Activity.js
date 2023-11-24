const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  // Book Information
  info: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    title: {
      type: String,
    },
  },

  // Category of the activity
  category: {
    type: String,
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
    },
    username: {
      type: String,
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
