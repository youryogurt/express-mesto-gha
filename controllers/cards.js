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

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  if (mongoose.Types.ObjectId.isValid(cardId)) {
    Card.findByIdAndDelete({ _id: cardId })
      .then((cards) => {
        if (cards) {
          res.send({ data: cards });
        } else {
          res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } else {
    res.status(400).send({ message: 'Некорректный id карточки' });
  }
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  if (mongoose.Types.ObjectId.isValid(cardId)) {
    Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (card) {
          res.send({ data: card });
        } else {
          res.status(404).send({ message: 'Передан несуществующий _id карточки' });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } else {
    res.status(400).send({ message: 'Некорректный id карточки' });
  }
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  if (mongoose.Types.ObjectId.isValid(cardId)) {
    Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (card) {
          res.send({ data: card });
        } else {
          res.status(404).send({ message: 'Карточка не найдена' });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } else {
    res.status(400).send({ message: 'Некорректный id карточки' });
  }
};

module.exports = {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
