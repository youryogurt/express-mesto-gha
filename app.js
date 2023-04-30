const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', (req, res) => {
  res.send('Hello World and users!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(`MongoDB connection error: ${err}`));

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// temporary authorization solution
app.use((req, res, next) => {
  req.user = {
    _id: '644cf58e44bfbdd4faf67d5a',
  };

  next();
});
