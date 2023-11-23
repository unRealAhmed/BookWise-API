const User = require("../models/User");
const Activity = require("../models/Activity");
const Book = require("../models/Book");
const Issue = require("../models/Issue");
const asyncHandler = require("../utils/asyncHandler")
const AppError = require("../utils/appErrors")
// const APIFeatures = require("../utils/apiFeatures")


exports.postIssueBook = asyncHandler(async (req, res, next) => {
  if (req.user.violationFlag) {
    return next(new AppError("You are flagged for violating rules/delay on returning books/paying fines. Untill the flag is lifted, You can't issue any books", 400))
  }

  if (req.user.bookIssueInfo.length >= 5) {
    return next(new AppError("warning", "You can't issue more than 5 books at a time", 400))
  }
  const book = await Book.findById(req.params.bookId);
  const user = await User.findById(req.params.userId);

  if (!book || !user) {
    return next(new AppError('Book or user not found', 404))
  }

  // registering issue
  book.stock -= 1;
  const issue = new Issue({
    book_info: {
      id: book._id,
      title: book.title,
      author: book.author,
      ISBN: book.ISBN,
      category: book.category,
      stock: book.stock,
    },
    user_id: {
      id: user._id,
      username: user.userName,
    },
  });

  // putting issue record on individual user document
  user.bookIssueInfo.push(book._id);

  // logging the activity
  const activity = new Activity({
    info: {
      id: book._id,
      title: book.title,
    },
    category: "Issue",
    time: {
      id: issue._id,
      issueDate: issue.book_info.issueDate,
      returnDate: issue.book_info.returnDate,
    },
    user_id: {
      id: user._id,
      username: user.userName,
    },
  });

  await issue.save({ validateBeforeSave: false });
  await user.save({ validateBeforeSave: false });
  await book.save({ validateBeforeSave: false });
  await activity.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: 'Book issued successfully' });
});

exports.postRenewBook = async (req, res, next) => {
  const searchObj = {
    user_id: {
      id: req.user._id,
    },
    book_info: {
      id: req.params.bookId,
    },
  };

  const issue = await Issue.findOne(searchObj);

  if (!issue) {
    return next(new AppError('Issue not found', 404))
  }

  // adding extra 7 days to that issue
  const time = issue.book_info.returnDate.getTime();
  issue.book_info.returnDate = time + 7 * 24 * 60 * 60 * 1000;
  issue.book_info.isRenewed = true;

  // logging the activity
  const activity = new Activity({
    info: {
      id: issue._id,
      title: issue.book_info.title,
    },
    category: "Renew",
    time: {
      id: issue._id,
      issueDate: issue.book_info.issueDate,
      returnDate: issue.book_info.returnDate,
    },
    user_id: {
      id: req.user._id,
      username: req.user.username,
    },
  });

  await activity.save({ validateBeforeSave: false });
  await issue.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: 'Book renewal successful' });
};

exports.postReturnBook = async (req, res, next) => {
  // Finding the position
  const { bookId } = req.params;
  const position = req.user.bookIssueInfo.indexOf(bookId);

  // Fetching book from db and incrementing stock
  const book = await Book.findById(bookId);
  if (!book) {
    return next(new AppError('Book not found', 404))
  }

  book.stock += 1;
  await book.save({ validateBeforeSave: false });

  // Removing issue
  const issue = await Issue.findOne({
    user_id: {
      id: req.user._id,
    }
  });
  if (!issue) {
    return next(new AppError('Issue not found', 404))
  }

  await issue.remove();

  // Popping book issue info from user
  req.user.bookIssueInfo.splice(position, 1);
  await req.user.save({ validateBeforeSave: false });

  // Logging the activity
  const activity = new Activity({
    info: {
      id: issue.book_info.id,
      title: issue.book_info.title,
    },
    category: "Return",
    time: {
      id: issue._id,
      issueDate: issue.book_info.issueDate,
      returnDate: issue.book_info.returnDate,
    },
    user_id: {
      id: req.user._id,
      username: req.user.username,
    },
  });
  await activity.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: 'Book returned successfully' });
};

