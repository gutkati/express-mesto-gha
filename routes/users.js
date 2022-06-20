const router = require('express').Router();
const { getUsers, getUserById, createUser, updateProfile, updateAvatar } = require('../controllers/users');

router.post('/users', createUser);  //создаёт пользователя с переданными в теле запроса name, about, avatar
router.get('/users', getUsers);  //возвращает всех пользователей из базы данных
router.get('/users/:userId', getUserById);  //возвращает пользователя по переданному _id
router.patch('/users/me', updateProfile);  //обновляет информацию о пользователе.
router.patch('/users/me/avatar', updateAvatar);  //запрос обновляет аватар пользователя.

module.exports = router;