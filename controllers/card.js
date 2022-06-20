const Card = require('../models/card');

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

function addError(req, res, card) {
  if (!card) {
    res.status(ERROR_REQUEST).send({message: "Карточка с указанным _id не найдена"})
  } else {
    res.status(200).send(card);
  }
}

module.exports.createCard = (req, res, next) => {
  const {name, link} = req.body;

  const id = req.user._id;  //id пользователя взяли из мидлвэры в файле app.js

  Card.create({name, link, owner: id})
    .then((card) => res.status(201).send({card}))
    .catch((err) => describeErrors(err, res))
    //.catch((err) => next(err))
}

module.exports.getCards = (req, res, next) => {
  Card.find({})          //поиск всех документов по параметрам
    .then(cards => res.status(200).send(cards))
    .catch((err) => describeErrors(err, res))
    //.catch((err) => next(err))
}

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove({_id: req.params.id, owner: req.user._id})  //удаление
    .then(card => {
      addError(req, res, card)
    })
    .catch((err) => describeErrors(err, res))
    //.catch((err) => next(err))
}

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    {_id: req.params.id, owner: req.user._id},
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  {
    new: true,
    runValidators: true
  },
)
    .then((card) => {
      addError(req, res, card);
    })
    .catch((err) => describeErrors(err, res))
    //.catch((err) => next(err))
}

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
  {_id: req.params.id, owner: req.user._id},
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  {
    new: true,
    runValidators: true
  },
)

  .then((card) => {
      addError(req, res, card);
    })
    .catch((err) => describeErrors(err, res))
    //.catch((err) => next(err))
};