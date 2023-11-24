const express = require('express')
const { protect, restrictTo } = require('../controllers/authController')
const { getAllUsers, getSingleUser, updateUser, uploadUserPhoto, resizeUserPhoto, getMe, updateUserProfile, deleteUserAccount } = require('../controllers/userController')

const router = express.Router()

router.use(protect)

router.get('/me', getMe, getSingleUser);
router.route('/:id').patch(uploadUserPhoto, resizeUserPhoto, updateUserProfile).delete(deleteUserAccount)

router.use(restrictTo('admin'))

router.get('/', getAllUsers)
router.get('/admin/update-user/:id', updateUser)

module.exports = router