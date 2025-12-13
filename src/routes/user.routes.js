const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');
const { idValidation } = require('../middleware/validator');

// All routes are admin only
router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.get('/:id', idValidation, getUser);
router.put('/:id', idValidation, updateUser);
router.delete('/:id', idValidation, deleteUser);

module.exports = router;
