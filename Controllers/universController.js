const Univers = require('../Model/univers'); 
const db = require('../database');
const openAI = require('../Model/openAI');
const stableImage = require('../Model/stableImage');
const fs = require("fs");
require("dotenv").config();
exports.getAllUnivers = (req, res) => {
    let query = "SELECT * FROM univers";
    db.query(query, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        let univers = [];
        for (let row of rows) {
          let univer = Univers.fromMap(row);
  
          univers.push(univer.toMap());
        }
  
        res.status(200).json(univers);
      }
    });
};

exports.createUniver = async (req, res) => {
  const universeName = req.body.name;

  try {
    const description = await openAI.createUniversDescription(universeName);
    const prompt = await openAI.createPromptUnivers(universeName);
    const imagePath = await stableImage.generateImage(prompt);

    const universe = Univers.fromMap(req.body);
    universe.description = description;
    universe.imagePath = imagePath;

    const query = "INSERT INTO univers (nom, description, image) VALUES (?, ?, ?)";

    db.query(query, [universe.name, universe.description, universe.imagePath], (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        universe.id = result.insertId;
        res.status(201).json(universe.toMap());
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getUniverById = (req, res) => {
  const univerId = req.params.id;
  const query = "SELECT * FROM univers WHERE id = ?";

  db.query(query, [univerId], (err, rows) => {
      if (err) {
          res.status(500).json({ error: err });
          return;
      }

      if (rows.length === 0) {
          res.status(404).json({ error: "Utilisateur non trouvé" });
          return;
      }

      const univer = Univers.fromMap(rows[0]);
      res.status(200).json(univer.toMap());
  });
};


exports.updateUniverById = (req, res) => {
    const univerId = req.params.id; 
    const updatedUniverData = req.body; 
    const query = "UPDATE univers SET nom = ?, description = ?, image = ? WHERE id = ?";

    db.query(query, [updatedUniverData.name,updatedUniverData.description,updatedUniverData.image, univerId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ error: "Utilisateur non trouvé" });
            } else {
                res.status(204).send(); 
            }
        }
    });
};


exports.deleteUniverseById = (req, res) => {
  const universeId = req.params.universeId;

  const deleteQuery = `
    DELETE personnages, univers
    FROM personnages
    INNER JOIN univers ON personnages.id_univers = univers.id
    WHERE univers.id = ?;
  `;

  db.query(deleteQuery, [universeId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Univers non trouvé" });
      } else {
        res.status(204).send();
      }
    }
  });
};
