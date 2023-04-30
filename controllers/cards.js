const Card = require('../models/card');

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  try {
    const newCard = await Card.create({ name, link });
    res.status(200).json(newCard);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const deleteCardById = async (req, res) => {
  const { cardId } = req.params;
  try {
    const deletedCard = await Card.findByIdAndDelete(cardId);
    if (!deletedCard) {
      res.status(404).json({ error: 'Карточка не найдена' });
    } else {
      res.status(200).json(deletedCard);
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
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
      res.status(404).json({ error: 'Карточка не найдена' });
    } else {
      res.status(200).json(card);
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
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
      res.status(404).json({ error: 'Карточка не найдена' });
    } else {
      res.status(200).json(card);
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

module.exports = {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
