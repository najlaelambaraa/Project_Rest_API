const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../database');

const authController = {
  autu: (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    db.query('SELECT * FROM utilisateur WHERE username = ? LIMIT 1', [username], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur de base de données' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Nom utilisateur ou mot de passe incorrect' });
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (bcryptErr, passwordMatch) => {
        if (bcryptErr) {
          return res.status(500).json({ error: 'Erreur lors de la vérification du mot de passe' });
        }

        if (!passwordMatch) {
          return res.status(401).json({ error: 'Nom utilisateur ou mot de passe incorrect' });
        }

        const payload = {
          id: user.id,
          username: user.username,
          email: user.email,
          exp: Math.floor(Date.now() / 1000) + 60 * 30,
        };

        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign(payload, secretKey);

        res.status(200).json({ token: token });
      });
    });
  },
};

module.exports = authController;


