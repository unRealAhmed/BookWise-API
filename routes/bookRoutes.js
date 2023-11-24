const express = require('express')
const { protect } = require('../controllers/authController')
const { issueBook, renewBook, returnBook, getAllBooks, getSingleBook } = require('../controllers/bookController')

const router = express.Router()

router.get('/', getAllBooks)
router.get('/:id', getSingleBook)

router.use(protect)

router.post('/:bookId/issue/:userId', issueBook)
router.post("/:bookId/renew", renewBook);
router.post("/:bookId/return", returnBook);

module.exports = router