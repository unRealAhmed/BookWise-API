const multer = require("multer")
const sharp = require("sharp")
const User = require("../models/User")
const Issue = require("../models/Issue");
const Comment = require("../models/Comment");
const Activity = require("../models/Activity")
const asyncHandler = require("../utils/asyncHandler")
const AppError = require("../utils/appErrors")

////////// Admin Access

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find()

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    users
  });
});

exports.getSingleUser = asyncHandler(async (req, res, next) => {

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError(`No user found with that ID`, 404));
  }

  // Send the retrieved document as a response.
  res.status(200).json({
    status: 'success',
    user
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // 2. Handle the case when no document is found
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  // 3. Send a success response with the updated data
  res.status(200).json({
    status: 'success',
    user
  });
});

//////////

const multerStorage = multer.memoryStorage();

// Check if the uploaded file is an image
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    // Allow the upload
    cb(null, true);
  } else {
    // Reject the upload
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// Set up multer with the defined storage and file filtering
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// Middleware to handle single photo upload
exports.uploadUserPhoto = upload.single('image');

// Middleware to resize the uploaded user photo
exports.resizeUserPhoto = asyncHandler(async (req, res, next) => {
  // Check if there's no file to process
  if (!req.file) return next();

  const user = await User.findById(req.user.id);

  // Generate a unique filename
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // Resize the image and convert it to jpeg format with quality adjustment
  await sharp(req.file.buffer)
    .resize(349, 708)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  // Update the user document with the new image filename
  user.image = req.file.filename;
  await user.save({ validateBeforeSave: false });

  const activity = new Activity({
    category: "Upload Photo",
    user_id: {
      id: req.user._id,
      username: user.userName,
    },
  });
  await activity.save();
  next();
});



const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    // If the property is in the list of allowed fields, add it to the new object
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  // Set the user's ID in the request parameters for retrieving the user's data
  req.params.id = req.user.id;
  next();
};

// Update user data except for password
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  // 1) Check if the request includes password-related fields; if so, disallow updates
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filter out any unwanted fields that should not be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  if (!updatedUser) {
    return next(new AppError('No user with that id !', 404))
  }

  const activity = new Activity({
    category: "Update Profile",
    user_id: {
      id: req.user._id,
      username: req.user.userName,
    },
  });
  await activity.save();

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteUserAccount = async (req, res, next) => {
  const userId = req.user._id;

  // Use deleteOne or deleteMany instead of remove
  await User.deleteOne({ _id: userId });

  await Issue.deleteMany({ "user_id.id": userId });
  await Comment.deleteMany({ "author.id": userId });
  await Activity.deleteMany({ "user_id.id": userId });

  res.status(204).json({
    status: "success",
    data: null
  });
};
