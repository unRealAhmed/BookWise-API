const express = require('express')
const { getAdminBookInventory, updateBook, deleteBook, flagUser, getUserAllActivities, showActivitiesByCategory, deleteUser, addNewBook } = require('../controllers/adminController')
const { protect, restrictTo } = require('../controllers/authController')

const router = express.Router()

router.use(protect, restrictTo('admin'))

router.get("/bookInventory/:page", getAdminBookInventory);
router.route('/:bookId').patch(updateBook).delete(deleteBook)
router.get("/flagged/:userId", flagUser);
router.get("/activities/:userId", getUserAllActivities);
router.get("/activities/:userId", showActivitiesByCategory);
router.delete("/:userId", deleteUser);
router.post("/add-newBook", addNewBook);

module.exports = router