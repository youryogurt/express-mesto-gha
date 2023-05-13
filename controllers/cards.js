const Card = require('../models/card');

const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const InternalServerError = require('../errors/internal-server-err');
const NotFoundError = require('../errors/not-found-err');

const getAllCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(new InternalServerError('Произошла ошибка на сервере'));
      }
    });
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findOne({ _id: cardId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (card.owner.toString() !== userId) {
        throw new ForbiddenError('Вы не можете удалить эту карточку');
      }
      return Card.findOneAndDelete({ _id: cardId, owner: userId });
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.send({ data: deletedCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный _id карточки'));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        next(new NotFoundError('Карточка по указанному _id не найдена'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new InternalServerError('Произошла ошибка на сервере'));
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
      } else if (err instanceof NotFoundError) {
        next(err);
      } else {
        next(new InternalServerError(err.message));
      }
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
