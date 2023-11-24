const express = require('express')
const { protect } = require('../controllers/authController')
const { createNewComment, updateComment, deleteComment } = require('../controllers/commentController')

const router = express.Router()

router.use(protect)

router.post('/:bookId', createNewComment)
router.route('/:bookId/:commentId').patch(updateComment).delete(deleteComment)

module.exports = router