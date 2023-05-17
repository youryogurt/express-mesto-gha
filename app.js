const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
// const { login, createUser } = require('./controllers/users');
// const { loginValidation, createUserValidation } = require('./validation/users');
// const auth = require('./middlewares/auth');
// const NotFoundError = require('./errors/not-found-err');

const app = express();
const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(`MongoDB connection error: ${err}`));

app.use(routes);
// app.post('/signin', loginValidation, login);
// app.post('/signup', createUserValidation, createUser);

// app.use(auth);
// app.use('/users', require('./routes/users'));
// app.use('/cards', require('./routes/cards'));

// app.use('*', () => {
//   throw new NotFoundError('Страница не найдена');
// });

app.use(errors());
app.use(errorHandler);
// app.use((err, req, res, next) => {
//   const { statusCode = 500, message } = err;
//   res
//     .status(statusCode)
//     .send({
//       message: statusCode === 500
//         ? 'На сервере произошла ошибка'
//         : message,
//     });
//   return next(err);
// });
