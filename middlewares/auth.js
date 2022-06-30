const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401

const SECRET_KEY = "some-secret-key";

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if(!token) {
    throw new UnauthorizedError('Пользователь не авторизован')
  }

  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY)
  } catch (err) {
    next(new UnauthorizedError('Пользователь не авторизован'))
  }

  req.user = payload; // в объект запроса записываем payload

  next();
}