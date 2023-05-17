const express = require('express');

const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUserInfo,
} = require('../controllers/users');

const {
  getUserByIdValidation,
  updateAvatarValidation,
  updateUserProfileValidation,
} = require('../validation/users');

const router = express.Router();

router.get('/me', getCurrentUserInfo);
router.get('/:userId', getUserByIdValidation, getUserById);
router.get('/', getUsers);
router.patch('/me', updateUserProfileValidation, updateUserProfile);
router.patch('/me/avatar', updateAvatarValidation, updateUserAvatar);

module.exports = router;
