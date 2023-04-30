const mongoose = require('mongoose');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.set('Content-Type', 'application/json');
      res.send({ data: users });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ message: 'Некорректный id пользователя' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.send({ data: user });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports = { getUserById };

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  const nameLength = name ? name.length : 0;
  const aboutLength = about ? about.length : 0;

  if (!name || !about || !avatar) {
    res.status(400).send({ message: 'Не передано одно из полей' });
  } else if (nameLength < 2 || nameLength > 30) {
    res.status(400).send({ message: 'Длина поля name должна быть от 2 до 30 символов' });
  } else if (aboutLength < 2 || aboutLength > 30) {
    res.status(400).send({ message: 'Длина поля about должна быть от 2 до 30 символов' });
  } else {
    User.create({ name, about, avatar })
      .then((user) => {
        res.status(200).send({ user });
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  }
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) res.send({ data: user });
      else res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      else res.status(500).send({ message: err.message });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) res.send({ data: user });
      else res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      else res.status(500).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
