const User = require('../Model/user'); 
const db = require('../database')
const authMiddleware = require('../Middleware/checkToken');
const bcrypt = require('bcrypt');

exports.getAllUsers = (req, res) => {
  let query = "SELECT * FROM utilisateur";
  db.query(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      let users = [];
      for (let row of rows) {
        let user = User.fromMap(row);

        users.push(user.toMap());
      }

      res.status(200).json(users);
    }
  });
};


exports.createUser = (req, res) => {
    
    const { name, password, username, email } = req.body;
  
  
    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        return res.status(500).json({ error: 'Erreur lors du hachage du mot de passe' });
      }
  
      
      const user = new User(name, hashedPassword, username, email);
  
      const query = "INSERT INTO utilisateur (name, password, username, email) VALUES (?, ?, ?, ?)";
  
      db.query(query, [user.name, user.password, user.username, user.email], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
  
        user.id = result.insertId;
        res.status(201).json(user.toMap());
      });
    });
  };
exports.getUserById = (req, res) => {
    const userId = req.params.id; 
    const query = "SELECT * FROM utilisateur WHERE id = ?";

    db.query(query, [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            if (rows.length === 0) {
                res.status(404).json({ error: "Utilisateur non trouvé" });
            } else {
                const user = User.fromMap(rows[0]); 
                res.status(200).json(user.toMap());
            }
        }
    });
};



exports.updateUserById = (req, res) => {
  const userId = +req.params.id;
  const updatedUserData = req.body;

  if (!req.user || req.user.id !== userId) {
    console.log('Autorisation failed');
    return res.status(403).json({ error: "Vous n'êtes pas autorisé" });
  }

  if (updatedUserData.password) {
    bcrypt.hash(updatedUserData.password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        return res.status(500).json({ error: 'Erreur hachage ' });
      }

      
      const query = "UPDATE utilisateur SET name = ?, password = ?, username = ?, email = ? WHERE id = ?";

      db.query(query, [updatedUserData.name, hashedPassword, updatedUserData.username, updatedUserData.email, userId], (err, result) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          if (result.affectedRows === 0) {
            res.status(404).json({ error: "Utilisateur non trouvé ou vous n'avez pas autorisé" });
          } else {
            res.status(204).send();
          }
        }
      });
    });
  } 
};


  

