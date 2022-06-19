const User = require('../models/user');

const ERROR_CODE = 400;
const ERROR_REQUEST = 404;
const ERROR_SERVER = 500;

function describeErrors(err, res) {
  if (err.name === "ValidationError" || err.name === "CastError") {
    res.status(ERROR_CODE).send({message: 'Переданы некорректные данные'})

  } else {

    res.status(ERROR_SERVER).send({message: 'Произошла ошибка сервера'})
  }
}

module.exports.createUser = (req, res) => {  //создать пользователя
  const{ name, about, avatar } = req.body;
  User.create({ name, about, avatar })  //записываем данные в базу
    .then(user => res.status(201).send({ data: user })) //возвращаем записанные данные в базу пользователю
    .catch((err) => describeErrors(err, res))
}

module.exports.getUsers = (req, res) => {
    User.find({})     //поиск всех документов по параметрам
    .then(users => res.status(200).send({ data: users }))
    .catch((err) => describeErrors(err, res))
}

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)  //поиск конкретного документа, ищет запись по _id
    .then((user) => {
      if (!user) {
        res.status(ERROR_REQUEST).send({message: "Пользователь по указанному Id не найден"});
        return;
      }

    res.status(200).send({data: user});
})

    .catch((err) => describeErrors(err, res))
}

module.exports.updateProfile = (req, res) => {
  const{ name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true
    }
    )
    .then(user => res.status(200).send({ data: user }))
    .catch((err) => describeErrors(err, res))
}

module.exports.updateAvatar = (req, res) => {
  const{ avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true
    }
    )
    .then(user => res.status(200).send({ data: user }))
    .catch((err) => describeErrors(err, res))
}
