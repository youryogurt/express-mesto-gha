const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { login, createUser } = require('../controllers/users');
const { loginValidation, createUserValidation } = require('../validation/users');

router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
