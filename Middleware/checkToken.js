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
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    if (decoded.exp <= Date.now() / 1000) {
      return res.status(401).json({ error: 'Token has expired' });
    }

    req.user = decoded;
    console.log('UserId ( checkTokenMw):', req.user.id); 
    next();
  });
};

module.exports = checkToken;


  