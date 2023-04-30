const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) res.send({ data: user });
      else res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') res.status(400).send({ message: 'Невалидный id' });
      else res.status(500).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) res.status(400).send({ message: 'Не передано одно из полей' });
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
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
