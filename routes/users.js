const express = require('express');
const {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

const router = express.Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
