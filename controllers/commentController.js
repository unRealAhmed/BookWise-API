const Comment = require("../models/Comment")
const asyncHandler = require("../utils/asyncHandler")
const AppError = require("../utils/appErrors")
const Activity = require("../models/Activity")
const Book = require("../models/Book")


exports.createNewComment = asyncHandler(async (req, res, next) => {

  const commentText = req.body.comment;
  const { bookId } = req.params;
  const userId = req.user._id;
  const username = req.user.userName;

  // fetching the book to be commented by id
  const book = await Book.findById(bookId);

  if (!book) {
    return next(new AppError('No book with that id !', 404))
  }

  // creating new comment instance
  const comment = new Comment({
    text: commentText,
    author: {
      id: userId,
      username
    },
    book: {
      id: book._id,
      title: book.title,
    },
  });
  await comment.save({ validateBeforeSave: false });

  // pushing the comment id to book
  book.comments.push(comment._id);
  await book.save({ validateBeforeSave: false });

  // logging the activity
  const activity = new Activity({
    info: {
      id: book._id,
      title: book.title,
    },
    category: "Comment",
    user_id: {
      id: userId,
      username
    },
  });
  await activity.save({ validateBeforeSave: false });

  res.status(201).json({
    status: "success",
    message: 'comment created successfully'
  })
});

exports.updateComment = async (req, res, next) => {
  const { commentId } = req.params;
  const commentText = req.body.comment;
  const { bookId } = req.params;
  const username = req.user.userName;
  const userId = req.user._id;

  // fetching the comment by id
  await Comment.findByIdAndUpdate(commentId, commentText);

  // fetching the book
  const book = await Book.findById(bookId);

  // logging the activity
  const activity = new Activity({
    info: {
      id: book._id,
      title: book.title,
    },
    category: "Update Comment",
    user_id: {
      id: userId,
      username
    },
  });
  await activity.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "comment updated successfully"
  })
};

exports.deleteComment = async (req, res, next) => {
  const { bookId } = req.params;
  const { commentId } = req.params;
  const userId = req.user._id;
  const username = req.user.userName;

  // fetching the book
  const book = await Book.findById(bookId);

  // finding the position and popping comment_id
  const pos = book.comments.indexOf(commentId);
  book.comments.splice(pos, 1);
  await book.save({ validateBeforeSave: false });

  // removing comment from Comment
  await Comment.findByIdAndRemove(commentId);

  // logging the activity
  const activity = new Activity({
    info: {
      id: book._id,
      title: book.title,
    },
    category: "Delete Comment",
    user_id: {
      id: userId,
      username: username,
    },
  });
  await activity.save({ validateBeforeSave: false });

  res.status(204).json({
    status: "success",
    data: null
  })
};