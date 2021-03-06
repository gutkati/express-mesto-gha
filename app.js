const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // мидлвэр
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { loginValid, creatUserValid } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(cookieParser()); // подключаем парсер кук как мидлвэр

// роуты без авторизации
app.post('/signup', creatUserValid, createUser);
app.post('/signin', loginValid, login);

// авторизация
app.use(auth);

// роуты защищенные авторизацией
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use(errors());

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  }

  res.status(500).send({ message: 'На сервере произошла ошибка' });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${PORT}`);
});
