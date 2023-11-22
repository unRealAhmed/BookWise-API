const mongoose = require('mongoose')
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { default: validator } = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide your email address'],
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // Custom validation to check if password and passwordConfirm match
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
      passwordChangedAt: Date,
      passwordResetToken: String,
      passwordResetExpires: Date,
    },
  })


const User = mongoose.model('User', userSchema)

module.exports = User