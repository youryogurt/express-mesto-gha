const mongoose = require('mongoose');
const Card = require('../models/card');

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  try {
    const newCard = await Card.create({ name, link });
    res.status(201).json({ _id: newCard._id });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: 'Переданы некорректные данные при создании карточки' });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};

const deleteCardById = async (req, res) => {
  const { cardId } = req.params;
  if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) {
    res.status(400).json({ message: 'Некорректный id карточки' });
    return;
  }

  try {
    const deletedCard = await Card.findByIdAndDelete(cardId);
    if (!deletedCard) {
      res.status(404).json({ message: 'Карточка с указанным _id не найдена' });
    } else {
      res.json(deletedCard);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate('owner likes');
    if (!card) {
      res.status(404).json({ message: 'Передан несуществующий _id карточки' });
    } else {
      res.status(200).json(card);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).populate('owner likes');
    if (!card) {
      res.status(404).json({ message: 'Карточка не найдена' });
    } else {
      res.status(200).json(card);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
