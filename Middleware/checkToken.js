const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const checkToken = (req, res, next) => {
  if (req.originalUrl === '/auth') {
    next();
    return;
  }

  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token has expired' });
      } else {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }

    req.user = decoded;

    next();
  });
};

module.exports = checkToken;
