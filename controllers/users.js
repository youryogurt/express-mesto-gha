const mongoose = require('mongoose');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      // res.set('Content-Type', 'application/json');
      res.send({ data: users });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  if (mongoose.Types.ObjectId.isValid(userId)) {
    User.findById({ _id: userId })
      .then((user) => {
        if (user) {
          res.send({ data: user });
        } else {
          res.status(404).send({ message: 'ользователь по указанному _id не найден' });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } else {
    res.status(400).send({ message: 'Некорректный id пользователя' });
  }
};

module.exports = { getUserById };

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
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
