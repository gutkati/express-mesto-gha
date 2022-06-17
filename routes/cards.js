const router = require('express').Router();
const { createCard, getCards, deleteCard, likeCard, dislikeCard } = require('../controllers/card');

router.get('/cards', getCards);  // возвращает все карточки из базы данных.
router.post('/cards', createCard);  //создает новую карточку по переданным параметрам
router.delete('/cards/:cardId', deleteCard);  //запрос удаляет карточку по _id
router.put('/cards/:cardId/likes', likeCard);  //добавляет лайк карточке
router.delete('/cards/:cardId/likes', dislikeCard);  //удаляет лайк с карточки

module.exports = router;