const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401

const SECRET_KEY = "some-secret-key";

module.exports = (req, res, next) => {
  const token = req.cookies.jwt
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

// module.exports = (req, res, next) => {
//   if (!req.cookies) {
//     return new UnauthorizedError('Пользователь не авторизован');
//   }
//
//   const token = req.cookies.jwt;
//   let payload;
//
//   try {
//     payload = jwt.verify(token, SECRET_KEY);
//   } catch (err) {
//     next(new UnauthorizedError('Пользователь не авторизован'));
//   }
//
//   req.user = payload; // записываем пейлоуд в объект запроса
//
//   next();
// };

// const handleAuthError = (res) => {
//   res
//     .status(401)
//     .send({ message: 'Необходима авторизация' });
// };
//
// const extractBearerToken = (header) => {
//   return header.replace('Bearer ', '');
// };
//
// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;
//
//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     return handleAuthError(res);
//   }
//
//   const token = extractBearerToken(authorization);
//   let payload;
//
//   try {
//     payload = jwt.verify(token, SECRET_KEY);
//   } catch (err) {
//     return handleAuthError(res);
//   }
//
//   req.user = payload; // записываем пейлоуд в объект запроса
//
//   next(); // пропускаем запрос дальше
// };