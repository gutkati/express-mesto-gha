const Card = require('../models/card');

const ERROR_CODE = 400;
const ERROR_REQUEST = 404;
const ERROR_SERVER = 500;

function describeErrors(err, res) {
  if(err.name === "ValidationError" || err.name === "CastError") {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' })
        return;
      }

      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка сервера' })
}

function addError(req, res, card) {
  if ((res.status(200) && card === null)) {
        const errorId = "error";
        throw errorId;
      }
}

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;

  const id = req.user._id;  //id пользователя взяли из мидлвэры в файле app.js

  Card.create({name, link, owner: id})
    .then(card => res.send({card}))
    .catch((err) => describeErrors(err, res))
}

module.exports.getCards = (req, res) => {
  Card.find({})          //поиск всех документов по параметрам
    .then(cards => res.send(cards))
    .catch((err) => describeErrors(err, res))
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove({_id: req.params.id, owner: req.user._id})  //удаление
    .then(card => {
      addError(req, res, card)
      res.send(card);
    })
    .catch(() => {
      if(!Card) {
        res.status(ERROR_REQUEST).send({message: "Карточка по указанному Id не найдена"})
      }
    })
    .catch((err) => describeErrors(err, res))
}

module.exports.likeCard = (req, res) => {
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
      res.send(card);
    })
    .catch(() => {
      if(!Card) {
        res.status(ERROR_REQUEST).send({message: "Карточка по указанному Id не найдена"})
      }
    })
    .catch((err) => describeErrors(err, res))
}


module.exports.dislikeCard = (req, res) => {
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
      res.send(card);
    })
    .catch(() => {
      if(!Card) {
        res.status(ERROR_REQUEST).send({message: "Карточка по указанному Id не найдена"})
      }
    })
    .catch((err) => describeErrors(err, res))
}