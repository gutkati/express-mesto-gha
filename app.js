const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');  //мидлвэр

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());  //для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); //для приема веб-страниц внутри POST-запроса


mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true
});

app.use((req, res, next) => {
  req.user = {
    _id: '62aae270f36f3dacb5ea7148' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});


app.use('/users', require('./routes/cards'));
app.use('/cards', require('./routes/users'));

app.use((err, req, res, next) => {
  if(err.name === "ValidationError" || err.name === "CastError") {
        res.status(400).send({ message: 'Переданы некорректные данные' })
        return;
      } else {
    res.status(500).send({ message: 'Произошла ошибка сервера' })
  }
next();
});

app.use((res, err) => {
  res.status(404).send({ err, message: err.message })
})


app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
})