const express = require('express')
const { signup, login, logout, protect, forgetPassword, resetPassword, updatePassword } = require('../controllers/authController')

const router = express.Router()

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);

router.patch('/updateMyPassword', updatePassword);

module.exports = router