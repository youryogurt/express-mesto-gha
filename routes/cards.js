const express = require('express');

const {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  createCardValidation,
  cardIdValidation,
} = require('../validation/cards');

const router = express.Router();

router.get('/', getAllCards);
router.post('/', createCardValidation, createCard);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', cardIdValidation, likeCard);
router.delete('/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = router;
