const express = require('express');
// const auth = require('../middlewares/auth');

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

router.get('/', getUsers);
router.get('/:userId', getUserByIdValidation, getUserById);
router.patch('/me', updateUserProfileValidation, updateUserProfile);
router.patch('/me/avatar', updateAvatarValidation, updateUserAvatar);
router.get('/me', getCurrentUserInfo);

module.exports = router;
