const Card = require('../models/card');

const ERROR_CODE = 400;
const ERROR_REQUEST = 404;
const ERROR_SERVER = 500;

function describeErrors(err, res) {
  if (err.name === "ValidationError" || err.name === "CastError") {
    res.status(ERROR_CODE).send({message: 'Переданы некорректные данные'})
  } else {
    return res.status(ERROR_SERVER).send({message: 'Произошла ошибка сервера'})
  }
}

function addError(req, res, card) {
  if (!card) {
    res.status(ERROR_REQUEST).send({message: "Карточка с указанным _id не найдена"})
  } else {
    return res.status(200).send(card);
  }
}

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;

  const id = req.user._id;  //id пользователя взяли из мидлвэры в файле app.js

  Card.create({name, link, owner: id})
    .then((card) => res.status(201).send({card}))
    .catch((err) => describeErrors(err, res))
}

module.exports.getCards = (req, res) => {
  Card.find({})          //поиск всех документов по параметрам
    .then((cards) => res.status(200).send(cards))
    .catch((err) => describeErrors(err, res))
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)  //удаление
    .then((card) => {
      addError(req, res, card)
    })
    .catch((err) => describeErrors(err, res))
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    (req.params.cardId),
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  {
    new: true,
    //runValidators: true
  },
)
    .then((card) => {
      addError(req, res, card);
    })
    .catch((err) => describeErrors(err, res))
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(  //удалит первое совпадение по id
  (req.params.cardId),
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  {
    new: true,
    //runValidators: true
  },
)

  .then((card) => {
      addError(req, res, card);
    })
    .catch((err) => describeErrors(err, res))
};